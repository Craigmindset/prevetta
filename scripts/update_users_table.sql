-- Update users table to include additional fields for better user management
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS company VARCHAR(255),
ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- Update existing users to split full_name into first_name and last_name
UPDATE users 
SET 
  first_name = SPLIT_PART(full_name, ' ', 1),
  last_name = CASE 
    WHEN ARRAY_LENGTH(STRING_TO_ARRAY(full_name, ' '), 1) > 1 
    THEN SUBSTRING(full_name FROM LENGTH(SPLIT_PART(full_name, ' ', 1)) + 2)
    ELSE ''
  END
WHERE first_name IS NULL OR last_name IS NULL;
