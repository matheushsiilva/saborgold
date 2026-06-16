# Sabor Gold — Plataforma Vapes Premium

E-commerce web para a marca **Sabor Gold**, com identidade dark + dourado, seleção de região, catálogo por marca (ELFBAR, IGNITE, etc.), sabores por produto e pedidos via **WhatsApp**.

## Fluxo do site

1. **`/`** — Landing: escolha da cidade/região
2. **`/catalogo`** — Grade de produtos filtrados por região e marca
3. **`/entrar`** — Login simplificado (WhatsApp ou e-mail)
4. **`/admin`** — Painel para regiões, marcas, produtos, banners e configurações

## Stack

- **Next.js 16** + React 19 + Tailwind CSS 4
- **Prisma 7** — SQLite (dev) ou **PostgreSQL / Supabase** (produção)
- **Framer Motion** — microinterações premium

## Início rápido

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

- Site: http://localhost:3000  
- Catálogo: http://localhost:3000/catalogo  
- Admin: http://localhost:3000/admin  

**Login admin:** `admin` ou `saborgold2026`

## Logo

O logo oficial está em `public/brand/logo-sabor-gold.png` e é usado em todo o site via componente `Logo`.

## Supabase (produção)

1. Crie o projeto em [supabase.com](https://supabase.com)
2. No SQL Editor, execute em ordem:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_platform_v2.sql`
3. Configure `.env`:

```env
DATABASE_URL="postgresql://..."
```

4. Em `prisma/schema.prisma`, use `provider = "postgresql"`
5. Aplique dados:

```bash
npx prisma db push
npm run db:seed
```

Detalhes: [docs/SUPABASE.md](docs/SUPABASE.md) · Push GitHub: [docs/GITHUB-PUSH.md](docs/GITHUB-PUSH.md)

## Painel admin

- **Regiões** — cidades com estoque regional
- **Marcas** — filtros dinâmicos no catálogo (ex.: ELFBAR, IGNITE)
- **Produtos** — preço, badge (LANÇAMENTO / PROMOÇÃO), sabores (`nome|descrição` por linha), estoque por região
- **Banners** e **Configurações** — WhatsApp, textos do site

Configure o número de WhatsApp em **Admin → Configurações** antes de publicar.

## APIs principais

| Rota | Uso |
|------|-----|
| `GET /api/regions` | Lista regiões ativas |
| `GET /api/brands` | Marcas para filtros |
| `GET /api/products?regiao=&marca=&busca=` | Catálogo regional |
| `POST /api/auth` | Login WhatsApp/e-mail |
| `GET/POST /api/settings` | WhatsApp e textos |

## Deploy (Vercel)

1. Push do repositório GitHub (conta com acesso ao repo)
2. Variável `DATABASE_URL` do Supabase
3. `provider = postgresql` no Prisma + `db push` + seed
