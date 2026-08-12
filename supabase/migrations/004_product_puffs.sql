-- Adiciona campo de puffs aos produtos (pods/vapes)
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "puffs" INTEGER;
