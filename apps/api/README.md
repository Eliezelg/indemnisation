# API Backend - Indemnisation Platform

Backend API NestJS pour la plateforme d'indemnisation de vols perturbés.

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Setup PostgreSQL database

**Option A: Run the automated script (from project root)**
```bash
bash scripts/setup-db.sh
```

**Option B: Manual setup**
```bash
sudo -u postgres psql
CREATE DATABASE indemnisation;
CREATE USER indemnisation WITH PASSWORD 'indemnisation123';
GRANT ALL PRIVILEGES ON DATABASE indemnisation TO indemnisation;
\c indemnisation
GRANT ALL ON SCHEMA public TO indemnisation;
\q
```

### 3. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Run database migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start development server

```bash
npm run dev
```

API will be available at `http://localhost:3001`

## 📋 Available Scripts

- `npm run dev` - Start development server with watch mode
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with initial data

## 🏗️ Project Structure

```
src/
├── main.ts              # Application entry point
├── app.module.ts        # Root module
├── auth/                # Authentication module
├── users/               # Users module
├── claims/              # Claims management module
├── compensation/        # Compensation calculation module
├── prisma/              # Prisma service
└── common/              # Shared utilities
    ├── guards/
    ├── decorators/
    └── filters/
```

## 🗄️ Database Schema

- **User**: User accounts with authentication
- **Claim**: Flight compensation claims

See `prisma/schema.prisma` for full schema details.

## 🔧 Configuration

Environment variables in `.env`:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT secret key
- `JWT_REFRESH_SECRET` - Refresh token secret
- `PORT` - API port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS

## 📝 API Endpoints

### Health Check
- `GET /health` - API health status

### Authentication (Phase 2)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token

### Claims (Phase 2+)
- `POST /claims` - Create new claim
- `GET /claims` - List user's claims
- `GET /claims/:id` - Get claim details

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📚 Technologies

- **NestJS 10** - Progressive Node.js framework
- **Fastify** - Fast web framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **TypeScript** - Type safety

## 🔐 Security

- Password hashing with bcrypt
- JWT-based authentication
- Input validation with class-validator
- CORS configuration
- Rate limiting (Phase 2)

## 📄 License

UNLICENSED - Private project
