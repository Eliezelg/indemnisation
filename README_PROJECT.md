# ✈️ Plateforme d'Indemnisation Vols Perturbés
## Système de Réclamation d'Indemnisation Aérienne

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

Plateforme web full-stack permettant aux passagers aériens de réclamer leur indemnisation pour vols retardés, annulés ou refus d'embarquement selon les réglementations **CE 261/2004 (UE)** et **loi israélienne**.

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/votre-org/indemnisation.git
cd indemnisation

# Install
pnpm install

# Setup
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your values

# Database
cd apps/api
npx prisma migrate dev
npx prisma db seed

# Run
cd ../..
pnpm dev

# Visit
# API: http://localhost:3001
# Web: http://localhost:3000
```

---

## 📚 Documentation

- 📖 [**Variables d'Environnement**](docs/ENVIRONMENT_VARIABLES.md)
- 🔄 [**Guide de Migration**](docs/MIGRATION_GUIDE.md)
- 📋 [**Session 2025-10-28**](docs/SESSION_2025-10-28.md)
- 🎯 [**Prochaine Session**](docs/PROCHAINE_SESSION.md)
- ❓ [**FAQ**](docs/FAQ.md)

---

## ✨ Dernière Mise à Jour - 28 Octobre 2025

### Phase 2 - Week 13-14: API de Vol ✅

**Ajouté:**
- ✅ Autocomplete aéroports (177 disponibles)
- ✅ Cache intelligent (-80-90% appels API)
- ✅ Validation numéro de vol (IATA)
- ✅ 6 nouveaux indexes DB
- ✅ Script test endpoints complet
- ✅ Migration base de données appliquée

**Voir:** [SESSION_2025-10-28.md](docs/SESSION_2025-10-28.md)

---

**Status:** 🚧 Phase 2 - 90% complète

**Prochaine étape:** Tests E2E + Optimisations (Week 17-18)
