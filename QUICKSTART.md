# 🚀 QUICKSTART - Plateforme d'Indemnisation

Guide de démarrage rapide pour développer sur le projet.

## ✅ Prérequis

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 15
- Git

## 📦 Installation (déjà fait !)

Le projet est déjà configuré avec :
- ✅ Structure monorepo
- ✅ Frontend Next.js 14
- ✅ Backend NestJS 10
- ✅ Base de données PostgreSQL
- ✅ 41 aéroports seedés

## 🎯 Démarrage rapide

### 1. Démarrer le backend (API)

```bash
cd apps/api
npm run dev
```

L'API sera disponible sur **http://localhost:3001**

**Endpoint de test** : http://localhost:3001/health

### 2. Démarrer le frontend (dans un autre terminal)

```bash
cd apps/web
npm run dev
```

Le site sera disponible sur **http://localhost:3000**

## 🧪 Tester que tout fonctionne

### Test API
```bash
curl http://localhost:3001/health
```

Devrait retourner :
```json
{
  "status": "ok",
  "timestamp": "2025-10-26T...",
  "service": "indemnisation-api",
  "version": "0.1.0"
}
```

### Test Frontend
Ouvrir http://localhost:3000 dans votre navigateur
Vous devriez voir la landing page.

## 🗄️ Base de données

### Voir la base de données
```bash
cd apps/api
npx prisma studio
```

Ouvre une interface graphique sur http://localhost:5555

### Informations de connexion
- **Database** : indemnisation
- **User** : indemnisation
- **Password** : indemnisation123
- **Host** : localhost
- **Port** : 5432

### Connection string
```
postgresql://indemnisation:indemnisation123@localhost:5432/indemnisation
```

## 📁 Structure du projet

```
indemnisation/
├── apps/
│   ├── web/              # Frontend Next.js (port 3000)
│   └── api/              # Backend NestJS (port 3001)
├── docs/                 # Documentation
├── scripts/              # Scripts utilitaires
└── package.json          # Root workspace
```

## 🛠️ Commandes utiles

### Depuis la racine du projet

```bash
# Installer toutes les dépendances
npm install

# Lancer tout (frontend + backend)
npm run dev

# Lancer uniquement le frontend
npm run dev:web

# Lancer uniquement le backend
npm run dev:api

# Build tout
npm run build

# Linter
npm run lint
```

### Base de données (depuis apps/api/)

```bash
# Générer le client Prisma
npm run db:generate

# Créer/appliquer migrations
npm run db:migrate

# Ouvrir Prisma Studio
npm run db:studio

# Seed les données
npm run db:seed
```

## 📚 Documentation

- [Cahier des charges](./docs/CAHIER_CHARGES_V4_REALISTE.md)
- [Plan de développement](./docs/PLAN_DEVELOPPEMENT_COMPLET.md)
- [Plan Phase 1](./docs/PHASE_1_PLAN_DETAILLE.md)
- [Session 1 complète](./docs/SESSION_1_COMPLETE.md)
- [README API](./apps/api/README.md)

## 🎯 Prochaines étapes de développement

**SESSION 2 : Authentification JWT**
- Implémenter register/login
- JWT avec access + refresh tokens
- Protection des routes
- Pages login/register frontend

Voir [PHASE_1_PLAN_DETAILLE.md](./docs/PHASE_1_PLAN_DETAILLE.md) pour le plan complet.

## 🐛 Problèmes courants

### L'API ne démarre pas
- Vérifier que PostgreSQL est démarré : `sudo systemctl status postgresql`
- Vérifier la connexion DB : `psql -U indemnisation -d indemnisation -h localhost`

### Erreur "Cannot find module @prisma/client"
```bash
cd apps/api
npx prisma generate
```

### Port 3000 ou 3001 déjà utilisé
```bash
# Tuer le processus sur le port
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

## ✅ Statut actuel

- ✅ Infrastructure complète
- ✅ Frontend opérationnel
- ✅ Backend opérationnel
- ✅ Base de données configurée
- ✅ 41 aéroports en base
- 🔄 Prêt pour Session 2 (Authentification)

## 🚀 Let's build!

Tout est prêt pour commencer à développer. Bon code ! 💪
