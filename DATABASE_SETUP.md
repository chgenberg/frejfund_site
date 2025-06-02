# Databas Setup för FrejFund

## Översikt
Vi rekommenderar **Supabase** för databas och autentisering eftersom det är:
- Gratis att komma igång
- Har inbyggd autentisering (email/lösenord, OAuth)
- PostgreSQL-databas
- Realtids-uppdateringar
- Enkelt att integrera med Next.js

## Steg 1: Skapa Supabase-projekt

1. Gå till [supabase.com](https://supabase.com)
2. Skapa ett nytt projekt
3. Spara din `Project URL` och `Anon Key`

## Steg 2: Installera Supabase

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

## Steg 3: Miljövariabler

Lägg till i `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=din-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=din-anon-key
```

## Steg 4: Databas-schema

Kör detta i Supabase SQL Editor:

```sql
-- Användare (hanteras av Supabase Auth)

-- Analyser
CREATE TABLE analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    
    -- Grunddata
    company_name TEXT NOT NULL,
    industry TEXT,
    score INTEGER NOT NULL,
    
    -- Analysdata (JSON)
    answers JSONB NOT NULL,
    insights JSONB,
    action_items JSONB,
    
    -- Premium data
    is_premium BOOLEAN DEFAULT FALSE,
    premium_analysis JSONB,
    
    -- Metadata
    title TEXT,
    description TEXT
);

-- Betalningar
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'SEK',
    payment_method TEXT,
    payment_id TEXT, -- Stripe/Klarna payment ID
    status TEXT DEFAULT 'pending'
);

-- Row Level Security (RLS)
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own analyses" ON analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analyses" ON analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses" ON analyses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses" ON analyses
    FOR DELETE USING (auth.uid() = user_id);

-- Samma för payments
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Steg 5: Auth Setup

Skapa `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Steg 6: Komponenter att skapa

1. **SignInForm** - Inloggningsformulär
2. **SignUpForm** - Registreringsformulär
3. **Dashboard** - Översikt över sparade analyser
4. **AnalysisDetail** - Visa sparad analys

## Nästa steg

1. Implementera autentisering
2. Spara analyser vid skapande
3. Skapa dashboard för att visa sparade analyser
4. Möjlighet att uppgradera sparade analyser till premium 