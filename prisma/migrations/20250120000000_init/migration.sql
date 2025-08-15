-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create analyses table
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    company_name TEXT NOT NULL,
    industry TEXT,
    score INTEGER NOT NULL,
    answers JSONB NOT NULL,
    insights JSONB,
    action_items JSONB,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_analysis JSONB,
    title TEXT,
    description TEXT,
    ultra_deep_analysis JSONB,
    ultra_deep_created_at TIMESTAMPTZ,
    insight_count INTEGER,
    data_quality_score INTEGER
);

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'SEK',
    payment_method TEXT,
    payment_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
);

-- Create indexes
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at);
CREATE INDEX idx_analyses_ultra_deep_created_at ON analyses(ultra_deep_created_at);
CREATE INDEX idx_analyses_insight_count ON analyses(insight_count);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_analysis_id ON payments(analysis_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for analyses table
CREATE TRIGGER update_analyses_updated_at
    BEFORE UPDATE ON analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 