export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const clean = cleanPhoneNumber(phone);
  return `https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(message)}`;
}

export function productOrderMessage(params: {
  productName: string;
  price: number;
  flavorName?: string;
  flavorDescription?: string;
  regionName?: string;
  userName?: string;
}): string {
  const { productName, price, flavorName, flavorDescription, regionName, userName } = params;
  let msg = `*SABOR GOLD — NOVO PEDIDO*\n━━━━━━━━━━━━━━━━━━━\n`;
  if (userName) msg += `Cliente: ${userName}\n`;
  if (regionName) msg += `Região: ${regionName}\n`;
  msg += `\n*Produto:* ${productName}\n`;
  if (flavorName) {
    msg += `*Sabor:* ${flavorName}\n`;
    if (flavorDescription) msg += `_${flavorDescription}_\n`;
  }
  msg += `*Valor:* R$ ${price.toFixed(2)}\n\nGostaria de finalizar este pedido!`;
  return msg;
}

export function generalContactMessage(regionName?: string): string {
  let msg = `Olá! Vim pelo site *Sabor Gold*.`;
  if (regionName) msg += `\nRegião: ${regionName}`;
  msg += `\n\nGostaria de informações sobre os produtos.`;
  return msg;
}
