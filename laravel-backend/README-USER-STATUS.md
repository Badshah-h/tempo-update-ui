# User Status Migration

This document provides instructions on how to add the user status functionality to the database.

## Option 1: Run the Migration Using Laravel

```bash
cd laravel-backend
php artisan migrate
```

## Option 2: Run the SQL Script Directly

You can run the SQL script directly in your database management tool (e.g., phpMyAdmin, MySQL Workbench, etc.):

```sql
-- Add status column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active' AFTER password;

-- Add last_active_at column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP NULL AFTER status;

-- Update existing users to have active status
UPDATE users SET status = 'active' WHERE status IS NULL;
```

## Option 3: Run the PHP Script

```bash
cd laravel-backend
php run-migration.php
```

## Verification

After running the migration, you can verify that the columns were added by running the following SQL query:

```sql
DESCRIBE users;
```

You should see the `status` and `last_active_at` columns in the output.

## Troubleshooting

If you encounter any issues, the application has been updated to handle the case where the columns don't exist. It will use default values for status ('active') and last_active_at (the user's updated_at timestamp).

However, for full functionality, it's recommended to add these columns to the database.
