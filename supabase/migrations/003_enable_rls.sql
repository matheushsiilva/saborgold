-- Sabor Gold — Habilitar RLS em todas as tabelas públicas
-- Isso resolve os erros "RLS Disabled in Public" no Security Advisor do Supabase.
--
-- Como o app usa Prisma (via connection string direta do Postgres),
-- o acesso ao banco NÃO passa pelo PostgREST/Supabase client,
-- então RLS não afeta o funcionamento normal da aplicação.
--
-- Nenhuma política (policy) é criada intencionalmente — isso bloqueia
-- qualquer acesso via Supabase client JS (anon/authenticated keys),
-- garantindo que as tabelas só sejam acessíveis pelo backend via Prisma.

-- Tabelas da migration 001
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Banner" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteSettings" ENABLE ROW LEVEL SECURITY;

-- Tabela Message (se existir da migration 001)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Message') THEN
    EXECUTE 'ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- Tabelas da migration 002
ALTER TABLE "Region" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Brand" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductFlavor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductRegion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
