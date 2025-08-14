-- Fix Row Level Security policies to allow user signup

-- Add INSERT policy for users table to allow new user registration
CREATE POLICY "Allow user registration" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Optional: Add a policy to allow service role to insert users (for admin operations)
-- CREATE POLICY "Service role can insert users" ON users
--   FOR INSERT WITH CHECK (auth.role() = 'service_role');
