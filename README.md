# Plateforme d'Indemnisation pour Vols Perturbés

## 📋 Description

Plateforme web permettant aux passagers aériens de réclamer facilement des indemnisations pour vols perturbés (retards, annulations, refus d'embarquement) selon les réglementations européenne (CE 261/2004) et israélienne (Aviation Services Law 2012).

## 🎯 Statut du projet

**Version actuelle** : 0.1.0 (MVP en développement)
**Phase** : ÉTAPE 1.1 - Initialisation structure monorepo
**Date** : 26 Octobre 2025

## 🏗️ Architecture

Ce projet utilise une architecture monorepo avec npm workspaces :

```
indemnisation/
├── apps/
│   ├── web/          # Frontend Next.js 14
│   └── api/          # Backend NestJS
├── packages/
│   ├── types/        # Types TypeScript partagés
│   └── config/       # Configuration partagée
├── docs/             # Documentation
└── scripts/          # Scripts utilitaires
```

## 🛠️ Stack Technologique

### Frontend
- **Framework** : Next.js 14 (App Router)
- **UI** : Tailwind CSS + Shadcn/ui
- **State** : React Context + TanStack Query
- **Forms** : React Hook Form + Zod
- **i18n** : next-intl (FR, HE, EN)

### Backend
- **Framework** : NestJS 10 avec Fastify
- **ORM** : Prisma
- **Auth** : JWT avec Passport
- **Validation** : class-validator

### Base de données
- **PostgreSQL 15** en local

### Infrastructure
- **VPS** : Hetzner (Phase 2)
- **Emails** : Brevo
- **Monitoring** : Better Stack (Phase 2)

## 📦 Prérequis

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 15
- Git

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <repo-url>
cd indemnisation
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration PostgreSQL

```bash
# Créer la base de données
sudo -u postgres psql
CREATE DATABASE indemnisation;
CREATE USER indemnisation WITH PASSWORD 'votre_password';
GRANT ALL PRIVILEGES ON DATABASE indemnisation TO indemnisation;
\q
```

### 4. Configuration des variables d'environnement

```bash
# Backend
cp apps/api/.env.example apps/api/.env
# Modifier DATABASE_URL, JWT_SECRET, etc.

# Frontend
cp apps/web/.env.example apps/web/.env.local
# Modifier NEXT_PUBLIC_API_URL
```

### 5. Migrations et seed

```bash
# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# Seed les données initiales (aéroports)
npm run db:seed
```

### 6. Lancer en développement

```bash
# Lancer frontend et backend
npm run dev

# Ou séparément :
npm run dev:web    # Frontend sur http://localhost:3000
npm run dev:api    # Backend sur http://localhost:3001
```

## 📜 Scripts disponibles

```bash
# Développement
npm run dev              # Lancer tout
npm run dev:web          # Frontend uniquement
npm run dev:api          # Backend uniquement

# Build
npm run build            # Build tout
npm run build:web        # Build frontend
npm run build:api        # Build backend

# Base de données
npm run db:generate      # Générer client Prisma
npm run db:push          # Push schéma (dev)
npm run db:migrate       # Créer/appliquer migration
npm run db:studio        # Ouvrir Prisma Studio
npm run db:seed          # Seed données

# Tests
npm run test             # Tests toutes apps
npm run lint             # Lint toutes apps

# Maintenance
npm run clean            # Supprimer node_modules
```

## 📖 Documentation

- [Cahier des charges V4](./docs/CAHIER_CHARGES_V4_REALISTE.md)
- [Plan de développement complet](./docs/PLAN_DEVELOPPEMENT_COMPLET.md)
- [Plan Phase 1 détaillé](./docs/PHASE_1_PLAN_DETAILLE.md)
- [Plan d'exécution Claude](./docs/PLAN_EXECUTION_CLAUDE.md)

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests E2E (Phase 2)
npm run test:e2e

# Coverage
npm run test:cov
```

## 🚢 Déploiement

Documentation disponible dans [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) (Phase 2)

## 📝 Contribuer

Ce projet suit la philosophie de développement documentée dans le [cahier des charges](./docs/CAHIER_CHARGES_V4_REALISTE.md#-philosophie-de-développement).

### Standards de commit

```
feat(scope): description courte
fix(scope): description du bug
chore(scope): tâches de maintenance
docs(scope): documentation
test(scope): tests
```

## 📄 Licence

UNLICENSED - Projet privé

## 👤 Auteur

Eli - 2025

---

**Statut actuel** : 🚧 En développement actif
**Prochaine étape** : Setup Next.js frontend
