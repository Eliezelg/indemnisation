#!/bin/bash

# Script to setup PostgreSQL database for Indemnisation platform
# Run this script as: bash scripts/setup-db.sh

echo "🔧 Setting up PostgreSQL database..."

# Database configuration
DB_NAME="indemnisation"
DB_USER="postgres"
DB_PASS="postgres"

echo "📝 Creating database and user..."
echo "You may need to enter your sudo password."

# Create user and database
sudo -u postgres psql <<EOF
-- Drop database and user if they exist (for clean setup)
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USER;

-- Create user
CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';

-- Create database
CREATE DATABASE $DB_NAME OWNER $DB_USER;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Connect to database and grant schema privileges
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;

-- Show success
\l $DB_NAME
EOF

echo "✅ Database setup complete!"
echo ""
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Password: $DB_PASS"
echo ""
echo "Connection string:"
echo "postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"
echo ""
echo "Next steps:"
echo "1. cd apps/api"
echo "2. npx prisma migrate dev --name init"
echo "3. npx prisma generate"
