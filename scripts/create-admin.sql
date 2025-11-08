-- Create Admin User Script
-- Run this in Supabase SQL Editor to create an admin user

-- Option 1: Make existing user an admin
-- Replace 'your-email@example.com' with your actual email
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Option 2: Check all users and their roles
SELECT id, email, name, role, created_at 
FROM users 
ORDER BY created_at DESC;

-- Option 3: Make the first user an admin (if just testing)
UPDATE users 
SET role = 'admin' 
WHERE id = (SELECT id FROM users ORDER BY created_at LIMIT 1);

-- Verify the change
SELECT email, role FROM users WHERE role = 'admin';

