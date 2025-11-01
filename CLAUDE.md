# CLAUDE.md

This file provides guidance to Claude Code when working with this project.

## Project Overview

Platform de réclamation d'indemnisation pour vols perturbés - Compensation claim platform for disrupted flights.

## Architecture

This is a monorepo with two main applications:

- **apps/api**: Backend API (NestJS) running on port 3001
- **apps/web**: Frontend Web (Next.js) running on port 3000

## Environment Variables

### API Backend (`apps/api/.env`)

```env
NODE_ENV=production
PORT=3001
DATABASE_URL="postgresql://webpro:7JhG3nJXBRFJa8QqmFyCdbaj1NAHPIqm@localhost:5432/indemnisation"
JWT_SECRET="ieLZcouWk1HPIQQ1ZYNl7bTEP5/lbANwnCYqHL9M2mK7UsmJz/NeXliH3H1tJ/72"
JWT_REFRESH_SECRET="ElSJvLKsKtiYZb0XzjseS6tSsVf21qAyUVuViJeH/WWWYn2+NTZGRlvtOh+fLKHt"
JWT_EXPIRATION="1h"
REFRESH_TOKEN_EXPIRATION="7d"
FRONTEND_URL="http://indem.webpro200.com"
RESEND_API_KEY="re_Hw5aRyVk_2oRKF89Pq4axs3qMSfPL2XjC"
EMAIL_FROM="noreply@webpro200.com"
```

### Web Frontend (`apps/web/.env`)

```env
NEXT_PUBLIC_API_URL=http://indem.webpro200.com/api
```

## Database

- **Database**: PostgreSQL 16.10
- **Database Name**: indemnisation
- **User**: webpro
- **Schema Management**: Prisma ORM
- **Location**: apps/api/prisma/schema.prisma

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Run migrations (production)
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

## Build Process

**IMPORTANT**: This project requires significant memory to build. The VPS has 2GB RAM + 2GB SWAP.

```bash
# Build both apps (requires ~3GB memory)
npm run build

# Build individually to save memory
npm run build:api    # Build API only
npm run build:web    # Build Web only
```

## Deployment

### Server Configuration

- **Domain**: indem.webpro200.com
- **Nginx**: Reverse proxy configured at `/etc/nginx/sites-available/indemnisation`
  - `/api/*` → localhost:3001 (API Backend)
  - `/*` → localhost:3000 (Web Frontend)

### Process Management (PM2)

The application should be managed with PM2:

```bash
# Start both apps
pm2 start ecosystem.config.js

# Or start individually
pm2 start npm --name "api" -- run start --workspace=apps/api
pm2 start npm --name "web" -- run start --workspace=apps/web

# Check status
pm2 status

# View logs
pm2 logs

# Restart
pm2 restart all

# Save configuration
pm2 save

# Setup startup script
pm2 startup
```

## Development vs Production

- **Development**: Uses `npm run dev` - hot reload enabled
- **Production**: Must build first with `npm run build`, then start with PM2

## Common Issues

### Out of Memory during Build

If build fails with error 137 (out of memory):
1. Check SWAP is enabled: `free -h`
2. Build apps separately: `npm run build:api` then `npm run build:web`
3. Consider stopping other services temporarily during build

### Database Connection Issues

If PostgreSQL connection fails:
1. Check PostgreSQL is running: `systemctl status postgresql`
2. Verify credentials in `.env` files
3. Check database exists: `sudo -u postgres psql -l`

### Nginx Routing

- Web frontend is accessible at: http://indem.webpro200.com
- API backend is accessible at: http://indem.webpro200.com/api
- API calls from frontend automatically route to backend

## Security

- SSH: Key-only authentication (no passwords)
- Firewall: UFW active (ports 22, 80, 443 only)
- Fail2ban: Active protection against brute force
- Database credentials: Stored in `/root/db_credentials.txt` (chmod 600)

## Useful Paths

- Project root: `/var/www/indemnisation`
- Nginx config: `/etc/nginx/sites-available/indemnisation`
- Logs: `/var/log/nginx/indemnisation_*.log`
- Database credentials: `/root/db_credentials.txt`

## Node.js Version

- Required: >= 18.0.0
- Installed: 20.19.5
