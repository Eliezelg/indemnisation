# 🔐 Variables d'Environnement
## Plateforme d'Indemnisation Vols Perturbés

**Dernière mise à jour** : 28 Octobre 2025

Ce document liste toutes les variables d'environnement requises pour faire fonctionner l'application.

---

## 📦 Backend (apps/api/.env)

### 🔧 Configuration Générale

```bash
# Environment
NODE_ENV=development              # development | production | test
PORT=3001                         # Port du serveur API
```

### 🗄️ Base de Données

```bash
# PostgreSQL Connection
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Exemple développement local:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/indemnisation"

# Exemple production (avec SSL):
DATABASE_URL="postgresql://user:password@db.example.com:5432/indemnisation?sslmode=require"
```

**Format détaillé:**
- `USER`: Nom d'utilisateur PostgreSQL
- `PASSWORD`: Mot de passe PostgreSQL
- `HOST`: Hôte du serveur (localhost, IP, ou domaine)
- `PORT`: Port PostgreSQL (défaut: 5432)
- `DATABASE`: Nom de la base de données

**Note:** Pour production, toujours utiliser `sslmode=require` pour sécuriser la connexion.

### 🔐 JWT Authentication

```bash
# JWT Secrets (MUST be different in production!)
JWT_SECRET="super-secret-jwt-key-for-dev-minimum-32-characters-long"
JWT_REFRESH_SECRET="super-secret-refresh-jwt-key-for-dev-minimum-32-characters"

# Token Expiration
JWT_EXPIRATION="1h"               # Access token: 1 heure
REFRESH_TOKEN_EXPIRATION="7d"    # Refresh token: 7 jours
```

**Génération de secrets sécurisés:**
```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**⚠️ IMPORTANT:**
- Secrets doivent avoir minimum 32 caractères
- Utiliser des secrets différents pour JWT et REFRESH
- **JAMAIS** commiter les secrets en production dans Git
- Utiliser des secrets différents entre dev/staging/prod

### 🌐 CORS & Frontend

```bash
# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"

# Production:
FRONTEND_URL="https://app.flightclaim.com"
```

### 📧 Email (Resend)

```bash
# Resend API
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"
```

**Obtenir une clé Resend:**
1. Créer compte sur [resend.com](https://resend.com)
2. Vérifier votre domaine
3. Générer une API key dans Settings

**Emails envoyés:**
- Confirmation d'inscription
- Réinitialisation de mot de passe
- Notifications de changement de statut
- Alertes admin

### ✈️ Flight APIs

```bash
# FlightAPI.io (Primary)
FLIGHTAPI_KEY="your_flightapi_key_here"
FLIGHTAPI_BASE_URL="https://api.flightapi.io"

# FlightLabs (Fallback/Historical)
FLIGHTLABS_KEY="your_flightlabs_jwt_token_here"
```

**FlightAPI.io:**
- **Usage:** Vols en temps réel (aujourd'hui ± 2 jours)
- **Obtenir:** [flightapi.io](https://flightapi.io)
- **Plans:**
  - Free: 100 req/mois
  - Pro: 10,000 req/mois (~30€/mois)

**FlightLabs:**
- **Usage:** Vols historiques (fallback)
- **Obtenir:** [flightlabs.io](https://flightlabs.io)
- **Plans:**
  - Free trial: 100 req
  - Paid: À partir de 50€/mois

**Notes:**
- Le système utilise FlightAPI.io en premier
- FlightLabs sert de fallback pour vols passés
- Mock provider si les deux échouent (dev uniquement)
- Cache intelligent réduit ~80-90% des appels API

---

## 🌐 Frontend (apps/web/.env.local)

```bash
# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Production:
NEXT_PUBLIC_API_URL=https://api.flightclaim.com
```

**⚠️ Important:**
- Toute variable préfixée `NEXT_PUBLIC_` est exposée au navigateur
- **NE JAMAIS** mettre de secrets avec ce préfixe
- Créer le fichier `.env.local` (pas commité dans Git)

---

## 📋 Template Complet

### Backend (.env)

Copier ce template dans `apps/api/.env`:

```bash
# ============================================
# CONFIGURATION GÉNÉRALE
# ============================================
NODE_ENV=development
PORT=3001

# ============================================
# BASE DE DONNÉES
# ============================================
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/indemnisation"

# ============================================
# JWT AUTHENTICATION
# ============================================
JWT_SECRET="CHANGE-ME-IN-PRODUCTION-minimum-32-characters-long"
JWT_REFRESH_SECRET="CHANGE-ME-TOO-IN-PRODUCTION-minimum-32-chars"
JWT_EXPIRATION="1h"
REFRESH_TOKEN_EXPIRATION="7d"

# ============================================
# CORS & FRONTEND
# ============================================
FRONTEND_URL="http://localhost:3000"

# ============================================
# EMAIL (Resend)
# ============================================
RESEND_API_KEY="re_your_api_key_here"
EMAIL_FROM="noreply@yourdomain.com"

# ============================================
# FLIGHT APIS
# ============================================
# FlightAPI.io (primary - real-time flights)
FLIGHTAPI_KEY="your_flightapi_key"
FLIGHTAPI_BASE_URL="https://api.flightapi.io"

# FlightLabs (fallback - historical flights)
FLIGHTLABS_KEY="your_flightlabs_jwt_token"
```

### Frontend (.env.local)

Copier ce template dans `apps/web/.env.local`:

```bash
# ============================================
# API BACKEND
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🔒 Sécurité - Checklist Production

### ✅ Avant le déploiement:

- [ ] Générer de nouveaux secrets JWT (32+ caractères)
- [ ] Secrets différents pour JWT et JWT_REFRESH
- [ ] Secrets différents entre dev/staging/prod
- [ ] `NODE_ENV=production`
- [ ] DATABASE_URL avec `sslmode=require`
- [ ] FRONTEND_URL pointe vers domaine de production
- [ ] API keys valides (FlightAPI, FlightLabs, Resend)
- [ ] EMAIL_FROM utilise votre domaine vérifié
- [ ] Fichiers `.env` dans `.gitignore`
- [ ] Variables stockées dans secrets manager (AWS, Vercel, etc.)

### 🚫 Ne JAMAIS faire:

- ❌ Commiter `.env` dans Git
- ❌ Utiliser les secrets de développement en production
- ❌ Partager secrets dans Slack/Email/Discord
- ❌ Exposer secrets avec `NEXT_PUBLIC_` prefix
- ❌ Réutiliser le même JWT_SECRET entre environnements
- ❌ Laisser des secrets par défaut en production

---

## 🛠️ Validation des Variables

### Script de vérification

Créer `scripts/check-env.sh`:

```bash
#!/bin/bash

echo "🔍 Checking environment variables..."

# Backend checks
cd apps/api

if [ ! -f .env ]; then
  echo "❌ apps/api/.env not found!"
  exit 1
fi

# Check critical variables
required_vars=(
  "DATABASE_URL"
  "JWT_SECRET"
  "JWT_REFRESH_SECRET"
  "FRONTEND_URL"
  "RESEND_API_KEY"
  "FLIGHTAPI_KEY"
)

for var in "${required_vars[@]}"; do
  if ! grep -q "^$var=" .env; then
    echo "❌ Missing: $var"
    exit 1
  fi
done

# Check JWT_SECRET length
jwt_secret=$(grep "^JWT_SECRET=" .env | cut -d'=' -f2 | tr -d '"')
if [ ${#jwt_secret} -lt 32 ]; then
  echo "⚠️  JWT_SECRET is too short (< 32 characters)"
fi

echo "✅ All required variables present"

# Frontend checks
cd ../web

if [ ! -f .env.local ]; then
  echo "⚠️  apps/web/.env.local not found (optional for dev)"
fi

echo "✅ Environment check complete"
```

### Utilisation:

```bash
chmod +x scripts/check-env.sh
./scripts/check-env.sh
```

---

## 🌍 Environnements Multiples

### Development (Local)

```bash
# apps/api/.env.development
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/indemnisation_dev"
FRONTEND_URL="http://localhost:3000"
```

### Staging

```bash
# apps/api/.env.staging
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@staging-db:5432/indemnisation?sslmode=require"
FRONTEND_URL="https://staging.flightclaim.com"
```

### Production

```bash
# Variables stockées dans secrets manager (pas de fichier .env)
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@prod-db:5432/indemnisation?sslmode=require"
FRONTEND_URL="https://app.flightclaim.com"
```

### Chargement conditionnel:

`apps/api/src/main.ts`:
```typescript
import { config } from 'dotenv';

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : `.env.${process.env.NODE_ENV || 'development'}`;

config({ path: envFile });
```

---

## 📊 Variables par Service

### Obligatoires pour démarrer:

| Variable | Service | Requis |
|----------|---------|--------|
| `DATABASE_URL` | API | ✅ OUI |
| `JWT_SECRET` | API | ✅ OUI |
| `JWT_REFRESH_SECRET` | API | ✅ OUI |
| `FRONTEND_URL` | API | ✅ OUI |
| `NEXT_PUBLIC_API_URL` | Web | ✅ OUI |

### Optionnelles (avec fallback):

| Variable | Service | Fallback |
|----------|---------|----------|
| `RESEND_API_KEY` | API | Logs only (pas d'email) |
| `FLIGHTAPI_KEY` | API | Mock provider |
| `FLIGHTLABS_KEY` | API | Ignore fallback |
| `PORT` | API | 3001 |
| `NODE_ENV` | API | development |

---

## 🧪 Tester la Configuration

### Test complet:

```bash
# 1. Vérifier variables présentes
./scripts/check-env.sh

# 2. Tester connexion DB
cd apps/api
npx prisma db pull

# 3. Tester API
npm run dev
# Dans un autre terminal:
curl http://localhost:3001/health

# 4. Tester tous les endpoints
./scripts/test-api.sh
```

### Tests individuels:

```bash
# Test DB
npx prisma studio

# Test JWT generation
node -e "const jwt = require('jsonwebtoken'); console.log(jwt.sign({test: true}, process.env.JWT_SECRET))"

# Test Flight API
curl "http://localhost:3001/flight-api/search?flightNumber=AF123&date=2025-10-28"

# Test Email (si RESEND_API_KEY configuré)
# Utiliser endpoint /test-email (à créer en dev)
```

---

## 📚 Ressources

**Documentation officielle:**
- [Prisma Environment Variables](https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)

**Générateurs de secrets:**
- [randomkeygen.com](https://randomkeygen.com/)
- [1password.com/password-generator](https://1password.com/password-generator/)

**Secrets Managers (Production):**
- AWS Secrets Manager
- Vercel Environment Variables
- Doppler
- HashiCorp Vault

---

## ❓ FAQ

**Q: Mes tokens JWT expirent trop vite, comment augmenter?**
A: Modifier `JWT_EXPIRATION` (ex: `"24h"`, `"7d"`, `"30d"`). Attention: tokens plus longs = moins sécurisé.

**Q: L'API ne trouve pas DATABASE_URL?**
A: Vérifier que `.env` est dans `apps/api/`, pas à la racine. Redémarrer le serveur après modification.

**Q: CORS errors en production?**
A: Vérifier que `FRONTEND_URL` matche exactement l'URL frontend (avec https://, sans trailing slash).

**Q: FlightAPI rate limit exceeded?**
A: Cache réduit 80-90% appels. Vérifier logs du cache. Upgrade plan si nécessaire.

**Q: Comment tester email sans Resend?**
A: Emails sont loggés dans console si `RESEND_API_KEY` manque. Créer account Resend gratuit pour tests.

---

**Document créé le:** 28 Octobre 2025
**Auteur:** Documentation automatique
**Version:** 1.0.0
