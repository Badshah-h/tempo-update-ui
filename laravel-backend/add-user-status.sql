-- Add status column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active' AFTER password;

-- Add last_active_at column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP NULL AFTER status;

-- Update existing users to have active status
UPDATE users SET status = 'active' WHERE status IS NULL;
