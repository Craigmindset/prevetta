-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vetting_results table
CREATE TABLE IF NOT EXISTS vetting_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  analysis_result JSONB NOT NULL,
  status VARCHAR(20) CHECK (status IN ('approved', 'rejected', 'needs_review')) DEFAULT 'needs_review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vetting_results_user_id ON vetting_results(user_id);
CREATE INDEX IF NOT EXISTS idx_vetting_results_status ON vetting_results(status);
CREATE INDEX IF NOT EXISTS idx_vetting_results_created_at ON vetting_results(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vetting_results ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for vetting_results table
CREATE POLICY "Users can view own vetting results" ON vetting_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vetting results" ON vetting_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vetting results" ON vetting_results
  FOR UPDATE USING (auth.uid() = user_id);
