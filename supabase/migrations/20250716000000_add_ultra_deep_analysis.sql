-- Add columns for ultra-deep analysis storage
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS ultra_deep_analysis JSONB,
ADD COLUMN IF NOT EXISTS ultra_deep_created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS insight_count INTEGER,
ADD COLUMN IF NOT EXISTS data_quality_score INTEGER;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_analyses_ultra_deep_created_at ON analyses(ultra_deep_created_at);
CREATE INDEX IF NOT EXISTS idx_analyses_insight_count ON analyses(insight_count); 