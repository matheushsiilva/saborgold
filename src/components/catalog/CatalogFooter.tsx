export default function CatalogFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#030303] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
        <p className="font-sans text-[10px] text-white/30 uppercase tracking-[0.25em]">
          © {new Date().getFullYear()} Sabor Gold — Todos os direitos reservados
        </p>
        <p className="text-[10px] text-gold/50 uppercase tracking-widest">
          Proibida a venda para menores de 18 anos
        </p>
        <nav className="flex flex-wrap justify-center gap-4 pt-2">
          <a href="#" className="text-[10px] text-white/25 hover:text-gold uppercase tracking-wider transition-colors">
            Política de privacidade
          </a>
          <a href="#" className="text-[10px] text-white/25 hover:text-gold uppercase tracking-wider transition-colors">
            Termos de uso
          </a>
        </nav>
      </div>
    </footer>
  );
}
