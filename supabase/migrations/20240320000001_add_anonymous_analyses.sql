-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add new columns to existing analyses table
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS anonymous BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS anonymous_email TEXT,
ADD COLUMN IF NOT EXISTS has_website BOOLEAN,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS bransch TEXT,
ADD COLUMN IF NOT EXISTS omrade TEXT;

-- Make user_id nullable for anonymous analyses
ALTER TABLE analyses 
ALTER COLUMN user_id DROP NOT NULL;

-- Create new index for anonymous email
CREATE INDEX IF NOT EXISTS idx_analyses_anonymous_email ON analyses(anonymous_email);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can insert their own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can update their own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can delete their own analyses" ON analyses;

-- Create updated policies
CREATE POLICY "Users can view their own analyses"
    ON analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their anonymous analyses"
    ON analyses FOR SELECT
    USING (auth.email() = anonymous_email);

CREATE POLICY "Users can insert their own analyses"
    ON analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id OR anonymous = true);

CREATE POLICY "Users can update their own analyses"
    ON analyses FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
    ON analyses FOR DELETE
    USING (auth.uid() = user_id); 