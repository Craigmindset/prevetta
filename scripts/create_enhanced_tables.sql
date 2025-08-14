-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS vetting_results CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create enhanced users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'user',
  subscription_plan VARCHAR(20) DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'premium', 'enterprise')),
  subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'cancelled')),
  credits_remaining INTEGER DEFAULT 10,
  total_uploads INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enhanced vetting_results table
CREATE TABLE IF NOT EXISTS vetting_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT,
  content_type VARCHAR(20) CHECK (content_type IN ('image', 'audio', 'video', 'text')) NOT NULL,
  transcription TEXT, -- For audio/video files
  analysis_result JSONB NOT NULL,
  compliance_score INTEGER CHECK (compliance_score >= 0 AND compliance_score <= 100),
  status VARCHAR(20) CHECK (status IN ('approved', 'rejected', 'needs_review', 'processing')) DEFAULT 'processing',
  flagged_categories TEXT[], -- Array of flagged content categories
  recommendations TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table for organizing vetting results
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  total_items INTEGER DEFAULT 0,
  approved_items INTEGER DEFAULT 0,
  rejected_items INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add campaign_id to vetting_results
ALTER TABLE vetting_results ADD COLUMN campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL;

-- Create activity_logs table for tracking user actions
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_plan, subscription_status);
CREATE INDEX IF NOT EXISTS idx_vetting_results_user_id ON vetting_results(user_id);
CREATE INDEX IF NOT EXISTS idx_vetting_results_status ON vetting_results(status);
CREATE INDEX IF NOT EXISTS idx_vetting_results_created_at ON vetting_results(created_at);
CREATE INDEX IF NOT EXISTS idx_vetting_results_campaign_id ON vetting_results(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vetting_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for vetting_results table
CREATE POLICY "Users can view own vetting results" ON vetting_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vetting results" ON vetting_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vetting results" ON vetting_results
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for campaigns table
CREATE POLICY "Users can view own campaigns" ON campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for activity_logs table
CREATE POLICY "Users can view own activity logs" ON activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs" ON activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample data for testing
INSERT INTO users (id, email, full_name, company_name, subscription_plan, credits_remaining, total_uploads) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'demo@prevetta.com', 'Demo User', 'Prevetta Demo Corp', 'premium', 50, 15);

INSERT INTO campaigns (id, user_id, name, description, total_items, approved_items, rejected_items) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Q1 2024 Campaign', 'First quarter advertising materials', 8, 5, 2);

INSERT INTO vetting_results (user_id, campaign_id, file_name, file_type, file_size, content_type, analysis_result, compliance_score, status, flagged_categories, recommendations) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'radio_ad_30sec.mp3', 'audio/mpeg', 1024000, 'audio', '{"overall_assessment": "Compliant with ARCON guidelines", "content_analysis": "Professional radio advertisement with clear messaging"}', 92, 'approved', '{}', 'Excellent compliance with advertising standards'),
  ('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'billboard_design.jpg', 'image/jpeg', 2048000, 'image', '{"overall_assessment": "Minor compliance issues detected", "content_analysis": "Billboard design needs disclaimer text adjustment"}', 78, 'needs_review', '{"disclaimer_missing"}', 'Add required disclaimer text in footer'),
  ('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'tv_commercial.mp4', 'video/mp4', 15728640, 'video', '{"overall_assessment": "Non-compliant content detected", "content_analysis": "Contains unsubstantiated health claims"}', 45, 'rejected', '{"health_claims", "misleading_content"}', 'Remove unsubstantiated health claims and provide scientific backing'),
  ('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'social_media_post.jpg', 'image/jpeg', 512000, 'image', '{"overall_assessment": "Fully compliant", "content_analysis": "Social media post meets all ARCON requirements"}', 95, 'approved', '{}', 'Excellent work - ready for publication'),
  ('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'podcast_ad.mp3', 'audio/mpeg', 768000, 'audio', '{"overall_assessment": "Compliant with minor suggestions", "content_analysis": "Good compliance with room for improvement"}', 85, 'approved', '{}', 'Consider adding more specific product information');
