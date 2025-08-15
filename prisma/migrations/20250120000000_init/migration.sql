-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "analyses" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
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

-- CreateTable
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

-- CreateIndex
CREATE INDEX "analyses_user_id_idx" ON "analyses"("user_id");

-- CreateIndex
CREATE INDEX "analyses_created_at_idx" ON "analyses"("created_at");

-- CreateIndex
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");

-- CreateIndex
CREATE INDEX "payments_analysis_id_idx" ON "payments"("analysis_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE; 