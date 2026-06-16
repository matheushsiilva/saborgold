-- Sabor Gold Platform v2 — Regiões, Marcas, Sabores
-- Execute no SQL Editor do Supabase após 001_initial_schema.sql

CREATE TABLE IF NOT EXISTS "Region" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "state" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Brand" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "ProductFlavor" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "inStock" BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "ProductRegion" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "regionId" TEXT NOT NULL REFERENCES "Region"("id") ON DELETE CASCADE,
  "inStock" BOOLEAN NOT NULL DEFAULT true,
  UNIQUE("productId", "regionId")
);

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE,
  "phone" TEXT UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "brandId" TEXT REFERENCES "Brand"("id") ON DELETE SET NULL;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "badge" TEXT;
