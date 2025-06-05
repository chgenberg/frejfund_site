-- Uppdatera analyses-tabellen med nya kolumner
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS anonymous BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS anonymous_email TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS has_website BOOLEAN,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS bransch TEXT,
ADD COLUMN IF NOT EXISTS omrade TEXT,
ADD COLUMN IF NOT EXISTS answers JSONB;

-- Skapa index för snabbare sökningar
CREATE INDEX IF NOT EXISTS idx_analyses_anonymous_email ON analyses(anonymous_email);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);

-- Uppdatera RLS policies
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Tillåt läsning av egna analyser
CREATE POLICY "Users can view their own analyses"
ON analyses FOR SELECT
USING (auth.uid() = user_id);

-- Tillåt läsning av anonyma analyser med samma email
CREATE POLICY "Users can view their anonymous analyses"
ON analyses FOR SELECT
USING (auth.email() = anonymous_email);

-- Tillåt skapande av nya analyser
CREATE POLICY "Anyone can create analyses"
ON analyses FOR INSERT
WITH CHECK (true);

-- Tillåt uppdatering av egna analyser
CREATE POLICY "Users can update their own analyses"
ON analyses FOR UPDATE
USING (auth.uid() = user_id); 