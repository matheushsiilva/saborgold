# Configurar Supabase — Sabor Gold

## 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Anote a **senha** do banco PostgreSQL

## 2. Connection string

Em **Project Settings → Database → Connection string**:

- **Transaction pooler** (recomendado para Vercel/serverless):
  ```
  postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
  ```

## 3. Atualizar o projeto

### `.env` (local ou Vercel)

```env
DATABASE_URL="postgresql://..."
```

### `prisma/schema.prisma`

Altere o provider:

```prisma
datasource db {
  provider = "postgresql"
}
```

### Aplicar schema

```bash
npx prisma db push
npm run db:seed
```

**Alternativa:** cole o conteúdo de `supabase/migrations/001_initial_schema.sql` no **SQL Editor** do Supabase e execute manualmente.

## 4. Deploy na Vercel

1. Conecte o repositório GitHub
2. Adicione a variável `DATABASE_URL` com a connection string do Supabase
3. Deploy automático após push

## 5. Storage (opcional)

Para imagens grandes, use **Supabase Storage** em vez de base64:

1. Crie bucket `produtos` (público)
2. Faça upload via dashboard ou API
3. Use a URL pública no campo `imageUrl` do produto/banner

O painel admin já aceita URLs `https://` e uploads base64.
