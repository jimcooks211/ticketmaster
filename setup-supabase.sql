-- Supabase Database Setup for Ticketmaster
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    stadium VARCHAR(255) NOT NULL,
    day VARCHAR(10) NOT NULL,
    date VARCHAR(20) NOT NULL,
    time VARCHAR(20) NOT NULL,
    order_num VARCHAR(50) NOT NULL,
    tickets JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_admin_id ON events(admin_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access to admins" ON admins FOR SELECT TO public USING (true);
CREATE POLICY "Allow service role to insert admins" ON admins FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Allow admins to update own profile" ON admins FOR UPDATE TO authenticated USING (auth.uid()::text = id::text) WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Allow public read access to events" ON events FOR SELECT TO public USING (true);
CREATE POLICY "Allow admins to create events" ON events FOR INSERT TO authenticated WITH CHECK (admin_id::text = auth.uid()::text);
CREATE POLICY "Allow admins to update own events" ON events FOR UPDATE TO authenticated USING (admin_id::text = auth.uid()::text) WITH CHECK (admin_id::text = auth.uid::::text);
CREATE POLICY "Allow admins to delete own events" ON events FOR DELETE TO authenticated USING (admin_id::text = auth.uid()::text);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin (username: admin, password: Logout$750011)
INSERT INTO admins (username, password)
VALUES ('admin', 'Logout$750011')
ON CONFLICT (username) DO NOTHING;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE admins TO anon, authenticated;
GRANT ALL ON TABLE events TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;