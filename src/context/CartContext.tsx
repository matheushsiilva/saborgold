'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Product type mirroring our Prisma schema
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CustomerData {
  name: string;
  phone: string;
  deliveryMethod: string;
  address?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  checkout: (customerData: CustomerData) => Promise<void>;
  whatsappNumber: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('5511999999999');

  // Load cart from localStorage and fetch WhatsApp number from settings
  useEffect(() => {
    const savedCart = localStorage.getItem('sabor_gold_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart', e);
      }
    }

    // Fetch site settings for WhatsApp number
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.whatsappNumber) {
          // Keep only numbers
          const cleanNumber = data.whatsappNumber.replace(/\D/g, '');
          setWhatsappNumber(cleanNumber);
        }
      })
      .catch((e) => console.error('Error fetching settings', e));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sabor_gold_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
    setIsCartOpen(true); // Open cart automatically when adding item
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const checkout = async (customerData: CustomerData) => {
    try {
      // 1. Post to API to save order in database for admin tracking
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerData.name,
          customerPhone: customerData.phone,
          deliveryMethod: customerData.deliveryMethod,
          address: customerData.address || '',
          items: cart.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
          })),
          totalPrice: cartTotal
        })
      });

      const orderData = await response.json();
      console.log('Order registered on server:', orderData);

      // 2. Generate the WhatsApp message URL
      let message = `*SABOR GOLD - NOVO PEDIDO*\n`;
      message += `━━━━━━━━━━━━━━━━━━━\n`;
      message += `*Cliente:* ${customerData.name}\n`;
      message += `*WhatsApp:* ${customerData.phone}\n`;
      message += `*Entrega:* ${customerData.deliveryMethod === 'motoboy' ? 'Motoboy (Entrega Rápida)' : 'Correios (Sedex)'}\n`;
      if (customerData.address) {
        message += `*Endereço:* ${customerData.address}\n`;
      }
      message += `━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `*PRODUTOS:*\n`;

      cart.forEach((item) => {
        const subtotal = (item.product.price * item.quantity).toFixed(2);
        message += `• ${item.quantity}x ${item.product.name} (R$ ${item.product.price.toFixed(2)} cada) - Subtotal: R$ ${subtotal}\n`;
      });

      message += `\n━━━━━━━━━━━━━━━━━━━\n`;
      message += `*TOTAL DO PEDIDO: R$ ${cartTotal.toFixed(2)}*\n`;
      message += `━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `Olá, gostaria de finalizar este pedido e acertar os detalhes do pagamento!`;

      // Clean number
      const cleanPhone = whatsappNumber.replace(/\D/g, '');
      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`;

      // 3. Clear cart
      clearCart();
      setIsCartOpen(false);

      // 4. Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');
    } catch (e) {
      console.error('Error processing checkout', e);
      alert('Ocorreu um erro ao finalizar seu pedido. Tente novamente.');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        checkout,
        whatsappNumber,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
