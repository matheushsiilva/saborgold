# Sabor Gold — Site Premium Vape & Lifestyle

Site profissional completo para a marca **Sabor Gold**, com identidade visual premium dark (preto fosco + dourado metálico), catálogo dinâmico, integração WhatsApp e painel administrativo.

## Stack

- **Next.js 16** + React 19
- **Tailwind CSS 4**
- **Prisma 7** + SQLite (dev) / PostgreSQL Supabase (produção)
- **Framer Motion** — animações premium

## Início rápido

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Acesse:
- Site: [http://localhost:3000](http://localhost:3000)
- Catálogo: [http://localhost:3000/catalogo](http://localhost:3000/catalogo)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

**Login admin:** `admin` ou `saborgold2026`

## Logo & Brand Assets

Arquivos em `public/brand/`:

| Arquivo | Uso |
|---------|-----|
| `logo-icon-gold.svg` | Ícone / favicon / Instagram |
| `logo-horizontal-gold.svg` | Header, banners |
| `logo-vertical-gold.svg` | Embalagens, stories |
| `logo-horizontal-white.svg` | Fundos escuros alternativos |
| `logo-monochrome.svg` | Impressão P&B |
| `logo-mockup.svg` | Apresentação da marca |

Mockup visual: abra `/brand/logo-mockup.svg` no navegador.

## Supabase (Produção)

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie a connection string (Settings → Database)
3. Configure `.env`:

```env
DATABASE_URL="postgresql://..."
```

4. Para PostgreSQL, altere `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
}
```

5. Aplique o schema:

```bash
npx prisma db push
npm run db:seed
```

Ou execute o SQL em `supabase/migrations/001_initial_schema.sql` no SQL Editor do Supabase.

## Painel Admin

Gerencie em `/admin`:

- Produtos (CRUD, upload de imagem, destaques)
- Categorias
- Banners promocionais (carrossel hero)
- Pedidos WhatsApp
- Mensagens de contato
- Configurações do site (textos, WhatsApp, Instagram, endereço)

## Deploy (Vercel)

1. Conecte o repositório [github.com/matheushsiilva/saborgold](https://github.com/matheushsiilva/saborgold)
2. Configure `DATABASE_URL` com Supabase
3. Build command: `npm run build`
4. Variáveis: `DATABASE_URL`, opcional `ADMIN_PASSWORD`

## Estrutura

```
src/
  app/          # Páginas e API routes
  components/   # UI premium (Header, Hero, Catálogo...)
  context/      # Carrinho + WhatsApp
  lib/          # Prisma client
prisma/         # Schema + seed
public/brand/   # Logos SVG
supabase/       # Migrations SQL
```

© Sabor Gold Co. — Todos os direitos reservados.
