-- Force create tables migration
-- This migration ensures tables exist even if previous migration failed

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (to handle partial migrations)
DROP TABLE IF EXISTS "payments" CASCADE;
DROP TABLE IF EXISTS "analyses" CASCADE;

-- Create analyses table
CREATE TABLE "analyses" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company_name" TEXT NOT NULL,
    "industry" TEXT,
    "score" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "insights" JSONB,
    "action_items" JSONB,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "premium_analysis" JSONB,
    "title" TEXT,
    "description" TEXT,
    "ultra_deep_analysis" JSONB,
    "ultra_deep_created_at" TIMESTAMP(3),
    "insight_count" INTEGER,
    "data_quality_score" INTEGER,
    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

-- Create payments table
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL,
    "analysis_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'SEK',
    "payment_method" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "stripe_payment_intent_id" TEXT,
    "metadata" JSONB,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX "analyses_user_id_idx" ON "analyses"("user_id");
CREATE INDEX "analyses_created_at_idx" ON "analyses"("created_at");
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");
CREATE INDEX "payments_analysis_id_idx" ON "payments"("analysis_id");

-- Add foreign key constraint
ALTER TABLE "payments" ADD CONSTRAINT "payments_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for analyses table
CREATE TRIGGER update_analyses_updated_at
    BEFORE UPDATE ON "analyses"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 