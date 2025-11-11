-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- IMPORTANT: Migration script for Clerk authentication
-- This modifies existing tables to work with Clerk instead of Supabase Auth

-- Step 1: DROP all existing RLS policies first (required before altering columns)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own meals" ON meals;
DROP POLICY IF EXISTS "Users can insert their own meals" ON meals;
DROP POLICY IF EXISTS "Users can update their own meals" ON meals;
DROP POLICY IF EXISTS "Users can delete their own meals" ON meals;

-- Step 2: Drop foreign key constraints (if they exist)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE meals DROP CONSTRAINT IF EXISTS meals_user_id_fkey;

-- Step 3: Alter column types to TEXT for Clerk user IDs
ALTER TABLE profiles ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE meals ALTER COLUMN user_id TYPE TEXT;

-- Step 4: Add missing columns to meals table if needed
ALTER TABLE meals ADD COLUMN IF NOT EXISTS timestamp TEXT;
ALTER TABLE meals ADD COLUMN IF NOT EXISTS meal_slot_id VARCHAR(255);

-- Step 5: Make sure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- Step 6: Create NEW RLS policies for Clerk
-- NOTE: Clerk user ID is in the 'sub' claim of the JWT
-- IMPORTANT: These policies won't work until you configure Supabase JWT settings

CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub')
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own profile"
    ON profiles FOR DELETE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policies for meals table
CREATE POLICY "Users can view their own meals"
    ON meals FOR SELECT
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own meals"
    ON meals FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own meals"
    ON meals FOR UPDATE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub')
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own meals"
    ON meals FOR DELETE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Indexes already exist, but create them if missing
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(date);
