# PLAN D'EXÉCUTION - DÉVELOPPEMENT MVP
## Par Claude - Assistant de développement

**Date de début** : 26 Octobre 2025
**Objectif** : Développer le MVP Phase 1 étape par étape
**Approche** : Itérative, testée, documentée

---

## 🎯 OBJECTIF IMMÉDIAT

Créer l'infrastructure de base du projet (Semaine 1, Jour 1-2) :
1. Structure monorepo
2. Application Next.js frontend
3. Application NestJS backend
4. Configuration Git

---

## 📋 ÉTAPES DE DÉVELOPPEMENT

### ✅ ÉTAPE 0 : Préparation (COMPLÉTÉ)
- [x] Analyse du cahier des charges existant
- [x] Création du cahier des charges V4 réaliste
- [x] Création du plan de développement complet
- [x] Création du plan détaillé Phase 1
- [x] Ajout de la philosophie de développement

### 🚀 ÉTAPE 1 : Initialisation du projet (EN COURS)

#### 1.1 Structure monorepo
```bash
Objectif: Créer la structure de base du projet
Durée estimée: 30 minutes

Tâches:
[ ] Vérifier que le dossier indemnisation/ existe
[ ] Initialiser Git si pas déjà fait
[ ] Créer structure de dossiers:
    indemnisation/
    ├── apps/
    │   ├── web/      # Next.js
    │   └── api/      # NestJS
    ├── packages/
    │   ├── types/    # Types partagés
    │   └── config/   # Config partagée
    ├── docs/         # Documentation (existe déjà)
    ├── scripts/      # Scripts utilitaires
    ├── .gitignore
    ├── package.json  # Root
    └── README.md

[ ] Créer package.json racine avec workspaces npm
[ ] Créer .gitignore complet
[ ] Premier commit: "chore: initialize monorepo structure"

Tests de validation:
- La structure de dossiers est créée
- package.json racine est valide
- Git est initialisé
```

#### 1.2 Frontend Next.js
```bash
Objectif: Créer l'application Next.js avec configuration de base
Durée estimée: 1 heure

Tâches:
[ ] Créer app Next.js dans apps/web/
    npx create-next-app@latest web \
      --typescript \
      --tailwind \
      --app \
      --no-src-dir \
      --import-alias "@/*"

[ ] Installer Shadcn/ui:
    cd apps/web
    npx shadcn-ui@latest init
    # Style: New York
    # Color: Zinc

[ ] Installer composants UI de base:
    npx shadcn-ui@latest add button
    npx shadcn-ui@latest add input
    npx shadcn-ui@latest add label
    npx shadcn-ui@latest add card
    npx shadcn-ui@latest add form

[ ] Créer structure de dossiers frontend:
    apps/web/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   ├── ui/           # Shadcn components
    │   ├── forms/
    │   └── layout/
    ├── lib/
    │   ├── api.ts
    │   └── utils.ts
    ├── types/
    └── public/

[ ] Créer landing page simple avec:
    - Hero section basique
    - Titre: "Réclamez votre indemnisation de vol"
    - CTA: Bouton "Commencer"

[ ] Tester: npm run dev (localhost:3000)

[ ] Commit: "feat(web): setup Next.js with Shadcn/ui"

Tests de validation:
- npm run dev fonctionne
- Page s'affiche sur localhost:3000
- Tailwind fonctionne
- Shadcn/ui components accessibles
```

#### 1.3 Backend NestJS
```bash
Objectif: Créer l'API NestJS avec structure modulaire
Durée estimée: 1h30

Tâches:
[ ] Créer app NestJS dans apps/api/:
    cd apps
    npx @nestjs/cli new api
    # Package manager: npm

[ ] Installer dépendances essentielles:
    cd api
    npm install @nestjs/config
    npm install @nestjs/passport passport passport-jwt
    npm install @nestjs/jwt
    npm install bcrypt @types/bcrypt
    npm install class-validator class-transformer
    npm install @prisma/client
    npm install -D prisma

[ ] Créer structure modulaire:
    src/
    ├── main.ts
    ├── app.module.ts
    ├── auth/
    │   └── auth.module.ts
    ├── users/
    │   └── users.module.ts
    ├── claims/
    │   └── claims.module.ts
    ├── compensation/
    │   └── compensation.module.ts
    ├── common/
    │   ├── guards/
    │   ├── decorators/
    │   └── filters/
    └── prisma/
        ├── prisma.module.ts
        └── prisma.service.ts

[ ] Configurer main.ts:
    - Port 3001
    - CORS (allow localhost:3000)
    - ValidationPipe global
    - Swagger (optionnel)

[ ] Créer endpoint de santé:
    @Controller()
    export class AppController {
      @Get('health')
      health() {
        return {
          status: 'ok',
          timestamp: new Date().toISOString()
        };
      }
    }

[ ] Créer .env.example:
    NODE_ENV=development
    PORT=3001
    DATABASE_URL=postgresql://user:pass@localhost:5432/indemnisation
    JWT_SECRET=your-secret-here
    JWT_REFRESH_SECRET=your-refresh-secret-here

[ ] Tester: npm run start:dev (localhost:3001)
[ ] Tester: curl http://localhost:3001/health

[ ] Commit: "feat(api): setup NestJS with module structure"

Tests de validation:
- npm run start:dev fonctionne
- GET /health retourne { status: 'ok', ... }
- CORS configuré
- ValidationPipe actif
```

#### 1.4 Configuration PostgreSQL + Prisma
```bash
Objectif: Base de données PostgreSQL + Prisma ORM configurés
Durée estimée: 1h30

Tâches:
[ ] Vérifier PostgreSQL installé:
    psql --version
    # Si pas installé, suivre instructions du plan détaillé

[ ] Créer base de données:
    sudo -u postgres psql
    CREATE DATABASE indemnisation;
    CREATE USER indemnisation WITH PASSWORD 'VotrePassword123!';
    GRANT ALL PRIVILEGES ON DATABASE indemnisation TO indemnisation;
    \q

[ ] Tester connexion:
    psql -U indemnisation -d indemnisation -h localhost

[ ] Initialiser Prisma:
    cd apps/api
    npx prisma init

[ ] Créer schéma Prisma (schema.prisma):
    - Model User (id, email, password, firstName, lastName, ...)
    - Model Claim (id, claimNumber, userId, flightNumber, ...)
    - Enums (DisruptionType, Jurisdiction, ClaimStatus)

[ ] Configurer .env:
    DATABASE_URL="postgresql://indemnisation:VotrePassword123!@localhost:5432/indemnisation"

[ ] Générer client Prisma:
    npx prisma generate

[ ] Créer et appliquer migration:
    npx prisma migrate dev --name init

[ ] Vérifier avec Prisma Studio:
    npx prisma studio
    # Ouvrir http://localhost:5555

[ ] Créer PrismaService:
    // src/prisma/prisma.service.ts
    @Injectable()
    export class PrismaService extends PrismaClient implements OnModuleInit {
      async onModuleInit() {
        await this.$connect();
      }
    }

[ ] Créer PrismaModule et exporter

[ ] Commit: "feat(api): setup PostgreSQL and Prisma ORM"

Tests de validation:
- Database existe et accessible
- Prisma client généré
- Migration appliquée
- Prisma Studio accessible
- PrismaService injectable
```

#### 1.5 Seed des aéroports
```bash
Objectif: Créer données de seed pour les aéroports
Durée estimée: 45 minutes

Tâches:
[ ] Créer prisma/seed.ts avec 30-50 aéroports:
    - France: CDG, ORY, NCE, LYS, MRS
    - Israël: TLV
    - Europe: AMS, FRA, MAD, BCN, FCO, LHR, etc.
    - International: JFK, DXB, IST, etc.

    Données par aéroport:
    - iata (code 3 lettres)
    - name
    - city
    - country
    - lat, lng (coordonnées GPS)

[ ] Configurer package.json pour seed:
    "prisma": {
      "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
    }

[ ] Installer ts-node:
    npm install -D ts-node

[ ] Exécuter seed:
    npx prisma db seed

[ ] Vérifier dans Prisma Studio

[ ] Commit: "feat(api): add airports seed data"

Tests de validation:
- Script seed s'exécute sans erreur
- 30+ aéroports en base
- Données visibles dans Prisma Studio
```

---

### 📊 ÉTAPE 1 - RÉSUMÉ

**Durée totale estimée** : 5-6 heures
**Résultat attendu** :
- ✅ Monorepo structuré
- ✅ Frontend Next.js fonctionnel (localhost:3000)
- ✅ Backend NestJS fonctionnel (localhost:3001)
- ✅ PostgreSQL configuré
- ✅ Prisma ORM configuré avec schéma
- ✅ Aéroports seedés

**Prêt pour** : ÉTAPE 2 - Authentification JWT

---

## 🔄 MÉTHODOLOGIE D'EXÉCUTION

### Pour chaque sous-étape :
1. **Lire** la description et les tâches
2. **Exécuter** les commandes une par une
3. **Vérifier** chaque étape avec les tests de validation
4. **Commiter** avec un message clair
5. **Documenter** les problèmes rencontrés
6. **Passer** à la sous-étape suivante

### En cas de blocage :
1. Lire l'erreur attentivement
2. Vérifier la documentation officielle
3. Chercher dans les issues GitHub du package
4. Demander de l'aide si nécessaire
5. Documenter la solution trouvée

### Standards de commit :
```
feat(scope): description courte
fix(scope): description du bug corrigé
chore(scope): tâches de maintenance
docs(scope): mise à jour documentation
test(scope): ajout/modification tests
refactor(scope): refactoring sans changement fonctionnel

Exemples:
feat(web): setup Next.js with Shadcn/ui
feat(api): add authentication module
fix(api): correct JWT expiration time
docs: update README with installation steps
```

---

## 📝 LOG D'EXÉCUTION

### Session 1 : 26 Octobre 2025

**Contexte** :
- Cahier des charges créé et validé
- Plan de développement créé
- Philosophie de développement définie
- Prêt à démarrer le développement

**État actuel** :
- [ ] ÉTAPE 1.1 : Structure monorepo
- [ ] ÉTAPE 1.2 : Frontend Next.js
- [ ] ÉTAPE 1.3 : Backend NestJS
- [ ] ÉTAPE 1.4 : PostgreSQL + Prisma
- [ ] ÉTAPE 1.5 : Seed aéroports

**Prochain objectif** : Commencer ÉTAPE 1.1

---

## 🎯 OBJECTIFS DE LA SESSION

1. **Immédiat** : Compléter ÉTAPE 1 (initialisation complète)
2. **Court terme** : ÉTAPE 2 (authentification)
3. **Cette semaine** : ÉTAPE 1-2 complètes

---

**Document créé le** : 26 Octobre 2025
**Mise à jour** : En continu
**Statut** : 🚀 Prêt à commencer
