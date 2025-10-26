# CAHIER DES CHARGES - VERSION 4.0 RÉALISTE
## Plateforme de Réclamation d'Indemnisation pour Vols Perturbés

**Date de création** : 26 Octobre 2025
**Statut** : ⚠️ **À DÉVELOPPER - PROJET DÉMARRE DE ZÉRO**
**Approche** : Pragmatique, itérative, pas à pas

---

## 📋 ÉTAT RÉEL DU PROJET

### Situation actuelle
- ❌ **Aucun code développé** - Le projet démarre de zéro
- ❌ **Pas d'infrastructure en place**
- ❌ **Pas de base de données configurée**
- ✅ **Cahier des charges clarifié**
- ✅ **Vision du projet définie**

### Contraintes techniques imposées
- ❌ **PAS de Supabase** - Authentification custom avec JWT
- ❌ **PAS de Docker** (en développement) - Installation locale native
- ✅ **PostgreSQL en local** - Installation système directe
- ✅ **VPS Hetzner** - Pas d'AWS au démarrage
- ✅ **Stack simple et pragmatique** - Pas de sur-ingénierie

---

## 🎯 PHILOSOPHIE DE DÉVELOPPEMENT

### Principes directeurs
1. **Développement itératif** : Chaque étape produit une version fonctionnelle testable
2. **Tests systématiques** : Validation complète avant passage à l'étape suivante
3. **Documentation continue** : Mise à jour de la documentation à chaque étape
4. **Architecture évolutive** : Base solide permettant l'ajout de fonctionnalités
5. **Code review permanent** : Vérification et amélioration continue du code
6. **Commits atomiques** : Chaque commit représente une unité logique fonctionnelle

### Méthodologie de travail
- **Développement par étapes isolées et testables** : Chaque module est indépendant
- **Revue complète après chaque étape** : Validation fonctionnelle et technique
- **Tests automatisés et manuels** : Coverage minimum 70% pour backend critique
- **Documentation API automatique** : Swagger/OpenAPI à jour en permanence
- **Git flow simple** : main (production) + branches feature/ pour développement
- **Déploiements progressifs** : Dev → Staging → Production

### Standards de qualité
```yaml
Code:
  - TypeScript strict mode activé
  - ESLint + Prettier configurés
  - Pas de any, types explicites partout
  - Commentaires pour logique complexe uniquement

Tests:
  - Tests unitaires pour services critiques (calculateurs, auth)
  - Tests d'intégration pour API endpoints
  - Tests E2E pour parcours utilisateur principaux
  - Minimum 70% coverage sur backend

Documentation:
  - README.md à jour
  - Swagger auto-généré
  - Commentaires JSDoc pour fonctions publiques
  - Architecture décisions (ADR) pour choix majeurs
```

---

## 1. PRÉSENTATION DU PROJET

### 1.1 Vision
Créer une plateforme web permettant aux passagers aériens de réclamer facilement des indemnisations pour vols perturbés, en se concentrant sur les marchés européen et israélien.

### 1.2 Objectifs SMART
- **Mois 1-2** : MVP fonctionnel avec formulaire de réclamation
- **Mois 3** : Calcul automatique des compensations (EU + Israël)
- **Mois 4-6** : Dashboard utilisateur et panel admin basique
- **Mois 7-12** : Automatisation et optimisations

### 1.3 Cibles
- **Primaire** : Passagers francophones et israéliens
- **Secondaire** : Passagers anglophones et hispanophones
- **Géographie** : Vols EU et Israël

### 1.4 Langues (ordre de priorité)
1. **Français** (FR) - Priorité 1, langue par défaut
2. **Hébreu** (HE) - Priorité 2, avec support RTL
3. **Anglais** (EN) - Priorité 3
4. **Espagnol** (ES) - Priorité 4 (optionnel Phase 2)

---

## 2. STACK TECHNOLOGIQUE SIMPLIFIÉE

### 2.1 Principes directeurs
- ✅ **KISS** (Keep It Simple, Stupid)
- ✅ **Pas de sur-ingénierie**
- ✅ **Technologies éprouvées**
- ✅ **Facile à maintenir**
- ✅ **Scalable quand nécessaire**

### 2.2 Frontend : Next.js 14

#### Choix et justification
```typescript
Framework: Next.js 14 (App Router)
Raison: SEO natif, SSR, performance, écosystème mature
```

#### Stack frontend minimale
```typescript
// Core
- Next.js 14 (App Router)
- React 18
- TypeScript

// Styling
- Tailwind CSS (simple, performant)
- Shadcn/ui (composants réutilisables)
- tailwindcss-rtl (pour l'hébreu)

// Forms
- React Hook Form (léger, performant)
- Zod (validation TypeScript)

// State
- useState/useContext (natif React)
- TanStack Query (cache API, Phase 2)

// i18n
- next-intl (mature, support RTL)
```

#### Structure des routes
```
app/
├── [locale]/
│   ├── page.tsx              # Landing page
│   ├── claim/
│   │   └── new/
│   │       └── page.tsx      # Formulaire réclamation
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard utilisateur
│   ├── login/
│   │   └── page.tsx          # Login
│   └── register/
│       └── page.tsx          # Inscription
```

### 2.3 Backend : NestJS (ou Node.js simple)

#### Option A : NestJS (recommandé)
**Avantages** :
- Architecture propre et modulaire
- TypeScript natif
- Dependency Injection
- Écosystème riche

**Stack** :
```typescript
// Core
- NestJS 10
- TypeScript
- Node.js 18+

// Base de données
- Prisma ORM (type-safe, migrations faciles)
- PostgreSQL 15

// Authentification
- Passport JWT
- bcrypt pour mots de passe

// Validation
- class-validator
- class-transformer

// Cache (Phase 2)
- node-cache (en mémoire au début)
- Redis (plus tard si nécessaire)
```

#### Option B : Express.js simple
**Si NestJS trop complexe au début** :
```typescript
- Express.js
- TypeScript
- Mêmes dépendances (Prisma, JWT, etc.)
```

#### Architecture backend minimale
```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── jwt.strategy.ts
├── claims/
│   ├── claims.controller.ts
│   ├── claims.service.ts
│   └── dto/
├── users/
│   ├── users.controller.ts
│   └── users.service.ts
├── compensation/
│   ├── eu-calculator.service.ts
│   └── israel-calculator.service.ts
└── prisma/
    └── schema.prisma
```

### 2.4 Base de données : PostgreSQL

#### Installation locale (sans Docker)

**Ubuntu/Debian** :
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Créer utilisateur et base
sudo -u postgres psql
CREATE USER indemnisation WITH PASSWORD 'votre_password';
CREATE DATABASE indemnisation OWNER indemnisation;
GRANT ALL PRIVILEGES ON DATABASE indemnisation TO indemnisation;
```

**macOS** :
```bash
brew install postgresql@15
brew services start postgresql@15

# Créer base
createdb indemnisation
```

**Windows** :
- Installer PostgreSQL depuis https://www.postgresql.org/download/windows/
- Utiliser pgAdmin 4 pour créer la base

#### Schéma Prisma minimal (Phase 1)
```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Phase 1 : Modèles essentiels uniquement

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String   // bcrypt hashed
  firstName     String
  lastName      String
  phone         String?
  emailVerified Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  claims        Claim[]

  @@index([email])
}

model Claim {
  id                   String         @id @default(cuid())
  claimNumber          String         @unique // Format: CLM-2025-000001
  userId               String

  // Informations vol
  flightNumber         String
  flightDate           DateTime
  departureAirport     String         // Code IATA
  arrivalAirport       String         // Code IATA
  airline              String?

  // Type de perturbation
  disruptionType       DisruptionType // DELAY, CANCELLATION, DENIED_BOARDING
  delayMinutes         Int?

  // Informations passager (JSON simple)
  passengerInfo        Json

  // Calculs de compensation
  calculatedAmountEU   Decimal?       @db.Decimal(10,2)
  calculatedAmountIL   Decimal?       @db.Decimal(10,2)
  recommendedAmount    Decimal?       @db.Decimal(10,2)
  jurisdiction         Jurisdiction?  // EU, ISRAEL, BOTH
  distance             Float?

  // Statut
  status               ClaimStatus    @default(DRAFT)
  submittedAt          DateTime?

  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt

  user                 User           @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([claimNumber])
  @@index([status])
  @@index([flightDate])
}

enum DisruptionType {
  DELAY
  CANCELLATION
  DENIED_BOARDING
}

enum Jurisdiction {
  EU
  ISRAEL
  BOTH
}

enum ClaimStatus {
  DRAFT           // Brouillon non soumis
  SUBMITTED       // Soumis, en attente de traitement
  IN_REVIEW       // En cours d'examen
  APPROVED        // Approuvé
  REJECTED        // Rejeté
  PAID            // Payé
  CANCELLED       // Annulé
}
```

### 2.5 Hébergement : VPS Hetzner

#### Configuration initiale recommandée

**VPS de départ** :
- **Type** : CPX21 (3 vCPU, 4GB RAM)
- **Prix** : ~8€/mois
- **OS** : Ubuntu 22.04 LTS
- **Localisation** : Falkenstein (Allemagne) ou Helsinki (Finlande)

**Stack sur le VPS** :
```
Ubuntu 22.04
├── Node.js 18+ (via nvm)
├── PostgreSQL 15 (installation native)
├── Nginx (reverse proxy)
├── PM2 (process manager pour Node.js)
├── Let's Encrypt (SSL gratuit)
└── UFW (firewall)
```

#### Déploiement simplifié
```bash
# Sur le VPS
# 1. Build local
npm run build

# 2. Copier les fichiers
rsync -avz --exclude node_modules ./ user@vps:/var/www/indemnisation/

# 3. Sur le VPS
cd /var/www/indemnisation
npm install --production
npm run db:migrate
pm2 restart indemnisation
```

### 2.6 Services externes (minimum vital)

#### Phase 1 (MVP)
```yaml
Essentiels:
  - Domaine: ~12€/an (Namecheap, Gandi)
  - VPS Hetzner: 8€/mois
  - Email transactionnel:
    - Option 1: Brevo (gratuit 300 emails/jour)
    - Option 2: SendGrid (gratuit 100 emails/jour)

Total Phase 1: ~10€/mois
```

#### Phase 2 (Croissance)
```yaml
Ajouts:
  - API données de vol:
    - AviationStack Basic: 50€/mois
    - OU Mock API au début (gratuit)
  - Stockage fichiers:
    - VPS local: gratuit
    - OU Cloudflare R2: ~1€/mois (100GB)
  - Monitoring:
    - Better Stack gratuit: 1 site

Total Phase 2: ~60€/mois
```

---

## 3. RÉGLEMENTATIONS APPLICABLES

### 3.1 Règlement Européen CE 261/2004

#### Conditions d'application
- Vols au départ d'un aéroport UE (toutes compagnies)
- Vols vers UE opérés par compagnie européenne
- Aussi valable : Islande, Norvège, Suisse

#### Montants d'indemnisation

**Retards de 3h+ à l'arrivée** :

| Distance | Indemnisation |
|----------|---------------|
| ≤ 1 500 km | 250€ |
| 1 500 - 3 500 km | 400€ |
| > 3 500 km | 600€ |

**Réduction de 50%** si réacheminement limite le retard à :
- 2h pour vols < 1 500 km
- 3h pour vols 1 500-3 500 km
- 4h pour vols > 3 500 km

#### Exceptions (pas d'indemnisation)
- Conditions météo extrêmes
- Grèves contrôle aérien (externe)
- Instabilité politique
- Problèmes de sécurité
- Défauts de fabrication cachés

**Important** : Les grèves internes de la compagnie ne sont PAS des circonstances extraordinaires.

#### Délais de prescription
- France : 5 ans
- Allemagne : 3 ans
- Espagne : 5 ans
- Italie : 2 ans
- Pays-Bas : 2 ans

### 3.2 Loi Israélienne sur les Services Aériens (2012)

#### Conditions d'application
- Vols au départ ou à destination d'Israël
- Sauf si compensation déjà reçue ailleurs

#### Montants (2024)

**Pour retard de 8h+ ou annulation** :

| Distance | Indemnisation |
|----------|---------------|
| ≤ 2 000 km | 1 490 ₪ (~380€) |
| 2 000 - 4 500 km | 2 390 ₪ (~620€) |
| > 4 500 km | 3 580 ₪ (~930€) |

**Réduction de 50%** si retard final < 4h/5h/6h selon distance.

#### Délais
- Prescription : 4 ans
- Paiement par compagnie : 45 jours après demande écrite

---

## 4. FONCTIONNALITÉS PAR PHASE

### PHASE 1 : MVP (Mois 1-2) - L'ESSENTIEL

#### Objectif : Démontrer la valeur
Créer une version minimaliste mais fonctionnelle qui permet de soumettre une réclamation et de calculer le montant.

#### 4.1.1 Landing page simple

**Contenu** :
- Hero avec proposition de valeur claire
- Calculateur rapide (estimateur en 2-3 questions)
- Section "Comment ça marche" (3 étapes)
- FAQ basique (10 questions)
- CTA vers formulaire de réclamation

**Pas de** :
- ❌ Témoignages (on n'en a pas encore)
- ❌ Statistiques complexes
- ❌ Blog (Phase 2)

#### 4.1.2 Authentification basique

**Pages** :
- Inscription (email/password)
- Connexion
- Mot de passe oublié (email reset)

**Fonctionnalités** :
- JWT access token (1h) + refresh token (7 jours)
- Cookies httpOnly sécurisés
- Hachage bcrypt
- Validation email (simple lien de confirmation)

**Pas de** :
- ❌ OAuth social (Google, Facebook) - Phase 2
- ❌ 2FA - Phase 3
- ❌ Sessions multiples - Phase 3

#### 4.1.3 Formulaire de réclamation (3 étapes simplifiées)

**Étape 1 : Vol**
```typescript
- Numéro de vol (input + validation format)
- Date du vol (datepicker)
- Aéroport de départ (select manuel, 20 aéroports majeurs)
- Aéroport d'arrivée (select manuel, 20 aéroports majeurs)
```

**Étape 2 : Perturbation**
```typescript
- Type : Retard / Annulation / Refus d'embarquement
- Durée du retard (si retard) : < 3h, 3-5h, 5-8h, > 8h
```

**Étape 3 : Passager**
```typescript
- Prénom, Nom
- Email
- Téléphone
- Adresse (rue, ville, code postal, pays)
```

**Pas de** :
- ❌ Upload de documents (Phase 2)
- ❌ Vérification automatique des vols (Phase 2)
- ❌ Multi-passagers (Phase 3)

#### 4.1.4 Calcul automatique de compensation

**Après soumission du formulaire** :
```typescript
1. Calculer la distance entre aéroports (formule Haversine)
2. Déterminer la juridiction applicable (EU/Israël/Both)
3. Calculer le montant EU (si applicable)
4. Calculer le montant Israël (si applicable)
5. Recommander le meilleur montant
6. Afficher le résultat à l'utilisateur
```

**Données nécessaires** :
- Base de 30-50 aéroports majeurs (hardcodé avec coordonnées GPS)
- Règles de calcul EU261
- Règles de calcul loi israélienne

#### 4.1.5 Dashboard utilisateur minimaliste

**Contenu** :
- Liste des réclamations avec statut
- Détail d'une réclamation (lecture seule)
- Montant calculé
- Statut actuel

**Pas de** :
- ❌ Timeline détaillée (Phase 2)
- ❌ Upload documents (Phase 2)
- ❌ Messagerie (Phase 3)

#### 4.1.6 Panel admin basique (CLI ou interface simple)

**Fonctionnalités minimales** :
- Lister les réclamations
- Voir détails d'une réclamation
- Changer le statut manuellement
- Filtrer par statut

**Peut être** :
- CLI avec Prisma Studio
- OU page web protégée par mot de passe
- OU script Node.js

**Pas de** :
- ❌ Dashboard visuel complexe (Phase 2)
- ❌ Statistiques (Phase 2)
- ❌ Gestion utilisateurs avancée (Phase 2)

#### 4.1.7 Notifications email basiques

**Emails essentiels** :
- Confirmation d'inscription (avec lien de vérification)
- Réclamation créée (confirmation + récapitulatif)
- Changement de statut

**Templates** :
- HTML simple (pas de design complexe)
- Français uniquement en Phase 1
- Autres langues en Phase 2

### PHASE 2 : Amélioration (Mois 3-4) - LA PROFESSIONNALISATION

#### 4.2.1 Multilingue complet
- Traduction complète (FR, HE, EN)
- Support RTL pour l'hébreu
- Sélecteur de langue
- Templates email multilingues

#### 4.2.2 Upload et gestion de documents
- Upload carte d'embarquement (requis)
- Upload autres documents (optionnel)
- Stockage local ou Cloudflare R2
- Limite 5MB par fichier

#### 4.2.3 API de données de vol
- Intégration AviationStack
- Vérification automatique du vol
- Cache des résultats (24h)
- Autocomplete des numéros de vol

#### 4.2.4 Dashboard admin visuel
- Interface web complète
- Statistiques basiques
- Filtres avancés
- Actions en masse

#### 4.2.5 Amélioration UX
- Formulaire en 5 étapes (au lieu de 3)
- Sauvegarde automatique (brouillon)
- Barre de progression
- Validation temps réel

### PHASE 3 : Automatisation (Mois 5-6) - L'EFFICACITÉ

#### 4.3.1 Automatisation avancée
- Génération automatique de courriers PDF
- Templates de réclamation par compagnie
- Envoi automatique (si API disponible)
- Suivi automatique des délais

#### 4.3.2 Amélioration admin
- Dashboard avec graphiques
- Rapports exportables
- Système de notes internes
- Assignation d'agents

#### 4.3.3 Communication
- Messagerie intégrée (utilisateur ↔ admin)
- Notifications push
- SMS pour événements importants

### PHASE 4 : Scale (Mois 7-12) - LA CROISSANCE

#### 4.3.1 Performance
- Mise en cache Redis
- Optimisation base de données
- CDN pour assets statiques

#### 4.3.2 Expansion
- Espagnol complet
- Nouvelles juridictions (optionnel)
- API B2B (partenaires)

#### 4.3.3 Mobile
- App React Native
- Ou PWA optimisée

---

## 5. ARCHITECTURE TECHNIQUE DÉTAILLÉE

### 5.1 Architecture globale

```
┌─────────────────────────────────────────────────────────────┐
│                      UTILISATEUR                             │
│              (Navigateur Web - Desktop/Mobile)               │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   VPS HETZNER (Ubuntu)                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              NGINX (Reverse Proxy + SSL)             │  │
│  │                 Port 80 → 443 redirect                │  │
│  └──────────────┬──────────────────┬────────────────────┘  │
│                 │                  │                        │
│                 ▼                  ▼                        │
│  ┌──────────────────────┐  ┌─────────────────────────┐    │
│  │  Frontend (Next.js)  │  │  Backend API (NestJS)   │    │
│  │     Port 3000        │  │      Port 3001          │    │
│  │   (Géré par PM2)     │  │    (Géré par PM2)       │    │
│  └──────────────────────┘  └──────────┬──────────────┘    │
│                                        │                    │
│                                        ▼                    │
│                            ┌────────────────────┐          │
│                            │  PostgreSQL 15     │          │
│                            │    Port 5432       │          │
│                            └────────────────────┘          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌────────────────────┐
              │ Services externes  │
              │  - Email (Brevo)   │
              │  - API vols (P2)   │
              └────────────────────┘
```

### 5.2 Flux de données : Créer une réclamation

```
1. Utilisateur remplit le formulaire (Frontend Next.js)
   │
   ▼
2. Validation côté client (Zod + React Hook Form)
   │
   ▼
3. POST /api/claims (JWT dans header Authorization)
   │
   ▼
4. Backend : Validation JWT + Vérification utilisateur
   │
   ▼
5. Validation DTO (class-validator)
   │
   ▼
6. Service de calcul :
   │
   ├─→ Calculer distance (formule Haversine)
   │
   ├─→ Déterminer juridiction (EU/IL/Both)
   │
   ├─→ Calculer montant EU (si applicable)
   │
   ├─→ Calculer montant IL (si applicable)
   │
   └─→ Recommander meilleur montant
   │
   ▼
7. Création dans PostgreSQL (Prisma)
   │
   ▼
8. Envoi email de confirmation (async)
   │
   ▼
9. Retour réponse JSON au frontend
   │
   ▼
10. Affichage confirmation + redirection dashboard
```

### 5.3 Sécurité

#### 5.3.1 Authentification JWT
```typescript
// Access Token (1h)
{
  sub: userId,
  email: user.email,
  iat: timestamp,
  exp: timestamp + 3600
}

// Refresh Token (7 jours)
{
  sub: userId,
  type: 'refresh',
  iat: timestamp,
  exp: timestamp + 604800
}
```

**Stockage** :
- Access token : Cookie httpOnly, secure, sameSite=strict
- Refresh token : Cookie httpOnly, secure, sameSite=strict

#### 5.3.2 Protection des routes
```typescript
// Frontend
middleware.ts → Vérifie access token → Redirige /login si expiré

// Backend
@UseGuards(JwtAuthGuard) → Vérifie JWT → Retourne 401 si invalide
```

#### 5.3.3 Validation
```typescript
// Frontend : Zod schemas
const claimSchema = z.object({
  flightNumber: z.string().regex(/^[A-Z0-9]{2,3}[0-9]{1,4}$/),
  flightDate: z.date().min(new Date('2022-01-01')),
  // ...
});

// Backend : DTOs avec class-validator
export class CreateClaimDto {
  @IsString()
  @Matches(/^[A-Z0-9]{2,3}[0-9]{1,4}$/)
  flightNumber: string;

  @IsDate()
  flightDate: Date;
  // ...
}
```

#### 5.3.4 Rate limiting (Phase 2)
```typescript
// Global : 100 req/min/IP
// Auth endpoints : 5 req/min/IP
// API endpoints : 60 req/min/user
```

#### 5.3.5 HTTPS et headers de sécurité
```nginx
# Nginx
ssl_protocols TLSv1.2 TLSv1.3;
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000";
```

### 5.4 Base de données

#### 5.4.1 Connection pooling
```typescript
// Prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Connection string
DATABASE_URL="postgresql://user:pass@localhost:5432/indemnisation?connection_limit=10"
```

#### 5.4.2 Migrations
```bash
# Créer migration
npx prisma migrate dev --name init

# Appliquer en production
npx prisma migrate deploy

# Seed data (aéroports)
npx prisma db seed
```

#### 5.4.3 Indexes (Phase 1)
```prisma
@@index([email])          // User lookup
@@index([claimNumber])    // Claim lookup
@@index([userId])         // User's claims
@@index([status])         // Filter by status
@@index([flightDate])     // Date range queries
```

### 5.5 Déploiement sur VPS Hetzner

#### 5.5.1 Configuration initiale du VPS

```bash
# 1. Connexion SSH
ssh root@YOUR_VPS_IP

# 2. Créer utilisateur non-root
adduser deploy
usermod -aG sudo deploy
su - deploy

# 3. Installer Node.js (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# 4. Installer PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Créer base de données
sudo -u postgres psql
CREATE USER indemnisation WITH PASSWORD 'STRONG_PASSWORD';
CREATE DATABASE indemnisation OWNER indemnisation;
GRANT ALL PRIVILEGES ON DATABASE indemnisation TO indemnisation;
\q

# 5. Installer Nginx
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 6. Installer PM2
npm install -g pm2

# 7. Configurer firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

#### 5.5.2 Configuration Nginx

```nginx
# /etc/nginx/sites-available/indemnisation

server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    # Redirection HTTPS (après Let's Encrypt)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    # SSL (configuré par certbot)
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activer la configuration
sudo ln -s /etc/nginx/sites-available/indemnisation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5.5.3 SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir certificat
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Renouvellement automatique (déjà configuré)
sudo certbot renew --dry-run
```

#### 5.5.4 Déploiement de l'application

**Option 1 : Deploy script (recommandé)**

```bash
# deploy.sh
#!/bin/bash

set -e

echo "🚀 Déploiement de l'application..."

# Variables
DEPLOY_USER="deploy"
VPS_IP="YOUR_VPS_IP"
APP_DIR="/home/deploy/indemnisation"

echo "📦 Build local..."
npm run build

echo "📤 Upload vers VPS..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.env.local' \
  --exclude '.next' \
  --exclude '.git' \
  ./ $DEPLOY_USER@$VPS_IP:$APP_DIR/

echo "🔧 Installation et migration sur VPS..."
ssh $DEPLOY_USER@$VPS_IP << 'ENDSSH'
  cd /home/deploy/indemnisation

  # Install dependencies
  npm install --production

  # Build
  npm run build

  # Run migrations
  cd apps/api
  npx prisma migrate deploy

  # Restart services
  pm2 restart indemnisation-api
  pm2 restart indemnisation-web
ENDSSH

echo "✅ Déploiement terminé!"
```

**Option 2 : Git (alternative)**

```bash
# Sur VPS
cd /home/deploy
git clone https://github.com/votre-repo/indemnisation.git
cd indemnisation
npm install
npm run build
npx prisma migrate deploy

# Démarrer avec PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 5.5.5 Configuration PM2

```javascript
// ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'indemnisation-api',
      cwd: './apps/api',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
    {
      name: 'indemnisation-web',
      cwd: './apps/web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

```bash
# Démarrer
pm2 start ecosystem.config.js

# Sauvegarder la config
pm2 save

# Auto-restart au boot
pm2 startup

# Monitoring
pm2 monit
pm2 logs
```

---

## 6. INTERNATIONALISATION (i18n)

### 6.1 Configuration next-intl

```typescript
// i18n.config.ts
export const locales = ['fr', 'he', 'en', 'es'] as const;
export const defaultLocale = 'fr' as const;

export type Locale = (typeof locales)[number];

// Direction RTL pour l'hébreu
export const getDirection = (locale: Locale): 'ltr' | 'rtl' => {
  return locale === 'he' ? 'rtl' : 'ltr';
};
```

### 6.2 Structure des traductions

```
messages/
├── fr/
│   ├── common.json
│   ├── claim.json
│   ├── auth.json
│   └── dashboard.json
├── he/
│   ├── common.json
│   ├── claim.json
│   ├── auth.json
│   └── dashboard.json
└── en/
    ├── common.json
    ├── claim.json
    ├── auth.json
    └── dashboard.json
```

### 6.3 Exemple de traductions

```json
// messages/fr/common.json
{
  "navigation": {
    "home": "Accueil",
    "myСlaims": "Mes réclamations",
    "newClaim": "Nouvelle réclamation",
    "login": "Connexion",
    "register": "S'inscrire",
    "logout": "Déconnexion"
  },
  "buttons": {
    "submit": "Soumettre",
    "cancel": "Annuler",
    "save": "Enregistrer",
    "next": "Suivant",
    "previous": "Précédent",
    "continue": "Continuer"
  }
}

// messages/he/common.json
{
  "navigation": {
    "home": "בית",
    "myClaims": "התביעות שלי",
    "newClaim": "תביעה חדשה",
    "login": "התחברות",
    "register": "הרשמה",
    "logout": "התנתקות"
  },
  "buttons": {
    "submit": "שלח",
    "cancel": "ביטול",
    "save": "שמור",
    "next": "הבא",
    "previous": "הקודם",
    "continue": "המשך"
  }
}
```

### 6.4 Support RTL

```typescript
// app/[locale]/layout.tsx
import { getDirection } from '@/i18n.config';

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const direction = getDirection(locale as Locale);

  return (
    <html lang={locale} dir={direction}>
      <body>{children}</body>
    </html>
  );
}
```

```css
/* Tailwind RTL support */
/* tailwind.config.js */
module.exports = {
  plugins: [
    require('tailwindcss-rtl'),
  ],
};

/* Usage */
<div className="ltr:ml-4 rtl:mr-4">
  Text with margin
</div>
```

---

## 7. MODÈLE ÉCONOMIQUE

### 7.1 Commission sur succès

**Principe** : Pas de frais si échec, commission uniquement sur montant récupéré.

**Taux** :
- Standard : 25% (+ TVA)
- Premium : 30% (service express, Phase 3)

**Exemple** :
```
Réclamation : 400€
Commission 25% : 100€
Passager reçoit : 300€
```

### 7.2 Coûts fixes mensuels

#### Phase 1 (MVP - Mois 1-2)
```yaml
Infrastructure:
  - VPS Hetzner CPX21: 8€
  - Domaine: 1€ (12€/an)
  - Email Brevo (gratuit): 0€
Total: ~10€/mois
```

#### Phase 2 (Croissance - Mois 3-6)
```yaml
Infrastructure:
  - VPS Hetzner CPX31: 15€
  - Domaine: 1€
  - Email Brevo Pro: 15€
  - API AviationStack: 50€
  - Cloudflare R2: 1€
Total: ~80€/mois
```

#### Phase 3 (Scale - Mois 7-12)
```yaml
Infrastructure:
  - VPS Hetzner CCX23: 50€
  - Domaine: 1€
  - Email SendGrid: 20€
  - API AviationStack Pro: 120€
  - Cloudflare R2: 5€
  - Monitoring Better Stack: 20€
Total: ~220€/mois
```

### 7.3 Projections financières

#### Hypothèses conservatrices
- Panier moyen : 400€
- Taux de succès : 70%
- Commission moyenne : 100€
- CAC (Coût Acquisition Client) : 30€

#### Objectifs Année 1

| Période | Réclamations/mois | Taux succès | CA mensuel | Coûts | Bénéfice |
|---------|-------------------|-------------|------------|-------|----------|
| Mois 1-2 (MVP) | 10 | 60% | 600€ | 10€ | 590€ |
| Mois 3-4 | 50 | 65% | 3,250€ | 80€ | 3,170€ |
| Mois 5-6 | 150 | 70% | 10,500€ | 80€ | 10,420€ |
| Mois 7-9 | 300 | 72% | 21,600€ | 220€ | 21,380€ |
| Mois 10-12 | 500 | 75% | 37,500€ | 220€ | 37,280€ |

**CA Année 1** : ~170k€
**Bénéfice brut** : ~160k€ (avant salaires)

#### Objectifs Année 2

| Trimestre | Réclamations/mois | CA mensuel | CA trimestre |
|-----------|-------------------|------------|--------------|
| T1 | 700 | 52,500€ | 157,500€ |
| T2 | 1,000 | 75,000€ | 225,000€ |
| T3 | 1,500 | 112,500€ | 337,500€ |
| T4 | 2,000 | 150,000€ | 450,000€ |

**CA Année 2** : ~1.17M€

---

## 8. CONFORMITÉ LÉGALE

### 8.1 RGPD

#### Mesures à implémenter

**Phase 1 (obligatoire)** :
- ✅ Politique de confidentialité claire
- ✅ CGU détaillées
- ✅ Consentement explicite collecte données
- ✅ Chiffrement mots de passe (bcrypt)
- ✅ HTTPS obligatoire
- ✅ Cookies sécurisés (httpOnly, secure)

**Phase 2** :
- ✅ Export des données utilisateur (JSON)
- ✅ Suppression de compte complet
- ✅ Droit à l'oubli
- ✅ Registre des traitements
- ✅ Logs d'accès aux données

**Phase 3** :
- ✅ DPO (Délégué à la Protection des Données)
- ✅ Analyse d'impact (DPIA)
- ✅ Audits de sécurité

#### Base légale du traitement
```
- Exécution du contrat : Traitement de la réclamation
- Intérêt légitime : Communications marketing (opt-out possible)
- Consentement : Cookies non essentiels, newsletter
```

#### Durée de conservation
```
- Données de compte : Durée de la relation + 3 ans
- Données de réclamation : 10 ans (prescription)
- Logs : 1 an
- Cookies : 13 mois maximum
```

### 8.2 Documents légaux requis

#### À créer avant lancement (Phase 1)

**1. Conditions Générales d'Utilisation (CGU)**
- Définition du service
- Obligations de la plateforme
- Obligations de l'utilisateur
- Tarification (commission 25%)
- Limitation de responsabilité
- Propriété intellectuelle
- Droit applicable et juridiction

**2. Politique de confidentialité**
- Données collectées et finalités
- Base légale du traitement
- Destinataires des données
- Durée de conservation
- Droits des utilisateurs (accès, rectification, suppression, etc.)
- Cookies et traceurs
- Sécurité des données
- Contact DPO

**3. Mentions légales**
- Éditeur du site (nom, adresse, SIRET)
- Responsable de publication
- Hébergeur (Hetzner)
- Contact

**4. Mandat de représentation**
- Contrat entre utilisateur et plateforme
- Délégation pour agir auprès de la compagnie
- Conditions de rémunération (commission)
- Durée du mandat
- Résiliation

#### Templates recommandés
- Utiliser des templates juridiques pour startup
- Faire relire par un avocat spécialisé
- Traduire dans les 3 langues principales (FR, HE, EN)

### 8.3 Conformité locale

#### France
- Inscription CNIL (si traitement sensible)
- Médiateur du tourisme (si CA > 300k€)
- Mentions légales conformes loi Hamon

#### Israël
- Conformité CAAI (Civil Aviation Authority of Israel)
- Protection des données (loi israélienne)
- Traduction documents juridiques en hébreu

#### Union Européenne
- Plateforme ODR (Online Dispute Resolution)
- Directive e-commerce
- PSD2 si paiements en ligne

### 8.4 Assurances (Phase 2)

```yaml
Recommandées:
  - RC Professionnelle: ~500€/an
    Couvre: Erreurs, omissions, conseils erronés

  - Protection juridique: ~300€/an
    Couvre: Frais d'avocat, litiges clients

  - Cyber-assurance: ~800€/an
    Couvre: Fuite données, cyberattaque, RGPD

Total: ~1,600€/an
```

---

## 9. MARKETING ET ACQUISITION

### 9.1 Stratégie Phase 1 (MVP - Budget 0€)

#### SEO gratuit
```
1. Contenu de qualité:
   - Page par compagnie (Air France, EasyJet, Ryanair, etc.)
   - Guide "Comment réclamer avec [Compagnie]"
   - FAQ complète

2. Mots-clés ciblés:
   - "indemnisation vol retardé"
   - "compensation vol annulé"
   - "réclamation [Compagnie]"

3. SEO technique:
   - Next.js SSR (bon pour SEO)
   - URLs propres (/fr/reclamation/air-france)
   - Meta descriptions
   - Schema.org markup
```

#### Réseaux sociaux organiques
```
- Facebook: Groupes "Voyages", "Bons plans"
- Reddit: r/travel, r/france
- Forums: Tripadvisor, FlyerTalk
- LinkedIn: Posts réguliers
```

#### Bouche-à-oreille
```
- Programme de parrainage (Phase 2):
  Parrain: -10% de commission
  Filleul: -10% de commission

- Témoignages clients
- Avis Google My Business
```

### 9.2 Stratégie Phase 2 (Budget 500-1000€/mois)

#### Google Ads
```yaml
Campagnes Search:
  - "vol retardé indemnisation"
  - "compensation vol annulé [ville]"
  - "réclamation [compagnie]"

Budget: 15-20€/jour = 500€/mois
CPC estimé: 1-2€
Conversions estimées: 30-50 réclamations/mois
```

#### Facebook/Instagram Ads
```yaml
Ciblage:
  - Âge: 25-55 ans
  - Intérêts: Voyages, avion
  - Comportement: Voyageurs fréquents

Budget: 300€/mois
Conversions estimées: 20-30 réclamations/mois
```

#### Partenariats
```
- Blogs voyage (articles sponsorisés)
- Influenceurs voyage (YouTube, Instagram)
- Comparateurs de vols (commission)
- Agences de voyage (B2B)
```

### 9.3 Stratégie Phase 3 (Budget 2000-5000€/mois)

#### Content marketing
```
- Blog actif (2-3 articles/semaine)
- Guides PDF téléchargeables
- Vidéos YouTube explicatives
- Webinaires
- Infographies
```

#### Affiliation
```
- Programme d'affiliation (15% de notre commission)
- Tracking avec UTM
- Dashboard affiliés
```

#### Retargeting
```
- Pixel Facebook/Google
- Remarketing visiteurs n'ayant pas converti
- Emails de relance (carrés abandonnés)
```

### 9.4 KPIs à suivre

```typescript
// Acquisition
- Visiteurs uniques/mois
- Sources de trafic (SEO, paid, direct, referral)
- Coût par clic (CPC)
- Coût d'acquisition client (CAC)

// Conversion
- Taux de conversion visiteur → inscription
- Taux de conversion inscription → réclamation
- Taux d'abandon par étape du formulaire

// Rétention
- Taux de réclamations multiples (même user)
- Net Promoter Score (NPS)
- Taux de parrainage

// Business
- Nombre de réclamations/mois
- Taux de succès
- Panier moyen
- CA mensuel
- Ratio LTV/CAC
```

---

## 10. ROADMAP ET PLANNING

### PHASE 1 : MVP (Mois 1-2) - 8 SEMAINES

#### Semaine 1-2 : Setup et infrastructure
- [x] Initialiser projet Next.js + NestJS (monorepo)
- [x] Configurer PostgreSQL local
- [x] Setup Prisma + schéma initial
- [x] Configuration Tailwind + Shadcn/ui
- [x] Configuration next-intl (FR uniquement en Phase 1)
- [x] Setup JWT authentication

**Livrables** :
- Repo Git initialisé
- Base de données locale fonctionnelle
- Architecture de base

#### Semaine 3-4 : Authentification
- [x] Page inscription (frontend)
- [x] Page connexion (frontend)
- [x] API register (backend)
- [x] API login + JWT (backend)
- [x] API refresh token (backend)
- [x] Middleware protection routes
- [x] Email de vérification basique

**Livrables** :
- Système d'auth complet et fonctionnel
- Tests d'auth

#### Semaine 5-6 : Formulaire de réclamation
- [x] Page formulaire multi-étapes (3 étapes)
- [x] Validation frontend (Zod)
- [x] API création réclamation
- [x] Service de calcul compensation (EU + Israël)
- [x] Service de calcul distance (Haversine)
- [x] Seed aéroports majeurs (30-50)

**Livrables** :
- Formulaire fonctionnel
- Calculs de compensation corrects
- Tests unitaires calculateurs

#### Semaine 7-8 : Dashboard et finitions MVP
- [x] Dashboard utilisateur (liste + détail)
- [x] Landing page simple
- [x] Panel admin basique (Prisma Studio ou CLI)
- [x] Emails de notification basiques
- [x] Tests end-to-end
- [x] Documentation

**Livrables** :
- MVP complet et fonctionnel
- Documenté
- Testé
- Prêt pour beta privée

**🎯 Objectif fin Phase 1** : Avoir 5-10 beta testeurs qui soumettent des réclamations réelles

---

### PHASE 2 : Amélioration (Mois 3-4) - 8 SEMAINES

#### Semaine 9-10 : Multilingue complet
- [ ] Traductions complètes (FR, HE, EN)
- [ ] Support RTL pour hébreu
- [ ] Sélecteur de langue
- [ ] Templates email multilingues
- [ ] Tests RTL

#### Semaine 11-12 : Upload documents
- [ ] Interface upload drag & drop
- [ ] Backend storage (local ou R2)
- [ ] Preview documents
- [ ] Validation admin documents

#### Semaine 13-14 : API de vol
- [ ] Intégration AviationStack
- [ ] Cache Redis (ou node-cache)
- [ ] Autocomplete numéros de vol
- [ ] Vérification automatique vol

#### Semaine 15-16 : Dashboard admin visuel
- [ ] Interface admin web complète
- [ ] Statistiques basiques
- [ ] Filtres et recherche
- [ ] Actions en masse
- [ ] Export données

**🎯 Objectif fin Phase 2** : 50-100 réclamations/mois, processus fluide

---

### PHASE 3 : Automatisation (Mois 5-6) - 8 SEMAINES

#### Semaine 17-18 : Génération automatique
- [ ] Templates PDF par compagnie
- [ ] Génération courriers automatique
- [ ] Merge données réclamation
- [ ] Preview avant envoi

#### Semaine 19-20 : Amélioration admin
- [ ] Dashboard avec graphiques
- [ ] Rapports exportables (Excel, PDF)
- [ ] Système de notes internes
- [ ] Assignation d'agents
- [ ] Timeline détaillée

#### Semaine 21-22 : Communication
- [ ] Messagerie intégrée (user ↔ admin)
- [ ] Notifications push
- [ ] SMS pour événements importants
- [ ] Webhooks (intégrations tierces)

#### Semaine 23-24 : Optimisations
- [ ] Cache Redis complet
- [ ] Optimisation DB (indexes, queries)
- [ ] CDN pour assets
- [ ] Monitoring avancé
- [ ] Tests de charge

**🎯 Objectif fin Phase 3** : 150-300 réclamations/mois, processus largement automatisé

---

### PHASE 4 : Scale (Mois 7-12) - 24 SEMAINES

#### Mois 7-8 : Performance et expansion
- [ ] Espagnol complet
- [ ] Migration VPS plus puissant (si nécessaire)
- [ ] Infrastructure multi-région (si volume)
- [ ] API publique B2B (préparation)

#### Mois 9-10 : Mobile
- [ ] PWA optimisée
- [ ] OU App React Native

#### Mois 11-12 : Growth et scale
- [ ] Programme d'affiliation
- [ ] Intégrations partenaires
- [ ] ML prédiction succès (optionnel)
- [ ] Amélioration continue

**🎯 Objectif fin Phase 4** : 500-1000 réclamations/mois, processus mature

---

## 11. ÉQUIPE ET RESSOURCES

### 11.1 Phase 1 (MVP) - Mois 1-2

**Développement** :
- 1 Full-stack developer (vous) - Temps plein
- Optionnel : 1 Designer freelance (20h) - 800€

**Pas besoin de** :
- ❌ Équipe support (vous gérez les 10 premiers clients)
- ❌ Marketing (SEO gratuit uniquement)
- ❌ Legal (templates gratuits en ligne)

**Budget total** : 0-800€ + 10€/mois infrastructure

### 11.2 Phase 2 (Amélioration) - Mois 3-4

**Développement** :
- 1 Full-stack developer (vous)
- Optionnel : 1 Développeur freelance (40h) - 2,400€

**Support** :
- 1 Support client temps partiel (20h/semaine) - 1,200€/mois
  - Multilingue (FR/EN minimum)
  - Gestion réclamations
  - Communication compagnies

**Marketing** :
- Vous-même (content marketing)
- Budget ads : 500-1000€/mois

**Budget total** : 2,000-3,500€/mois

### 11.3 Phase 3-4 (Scale) - Mois 5-12

**Développement** :
- 1 Full-stack developer (vous)
- 1 Développeur junior/mid (temps plein) - 3,000-4,000€/mois

**Support** :
- 2 Support clients (temps plein) - 2,500-3,000€/mois chacun
- 1 Manager support (temps partiel) - 2,000€/mois

**Marketing** :
- 1 Marketing/Growth (temps partiel) - 2,000-3,000€/mois
- Budget ads : 2,000-5,000€/mois

**Legal** :
- Avocat conseil (forfait) - 500-1,000€/mois

**Budget total** : 12,000-20,000€/mois

---

## 12. RISQUES ET MITIGATION

### 12.1 Risques techniques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Panne VPS | Faible | Élevé | Backups quotidiens, monitoring, plan de recovery |
| Bug critique production | Moyenne | Élevé | Tests, staging, rollback rapide, monitoring |
| Surcharge trafic | Faible (début) | Moyen | Scalabilité VPS, CDN, cache |
| Perte de données | Très faible | Critique | Backups automatiques quotidiens + offsite |
| Problème API vols | Moyenne | Moyen | Multi-provider, fallback manuel |

### 12.2 Risques business

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Pas de clients | Moyenne | Critique | Marketing agressif, SEO, beta gratuite |
| Taux de succès faible | Moyenne | Élevé | Sélection des cas, expertise juridique |
| Concurrence | Haute | Moyen | Différenciation (multi-juridiction, UX, prix) |
| Délais de paiement longs | Haute | Moyen | Trésorerie, factoring possible |
| CAC trop élevé | Moyenne | Élevé | SEO gratuit, bouche-à-oreille, parrainage |

### 12.3 Risques réglementaires

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Non-conformité RGPD | Faible | Critique | Conformité dès Phase 1, DPO Phase 2 |
| Changement réglementation | Moyenne | Élevé | Veille juridique, architecture flexible |
| Licence requise | Faible | Élevé | Vérification préalable, avocat conseil |
| Problème avec compagnie | Haute | Moyen | Documentation solide, base de précédents |

### 12.4 Plan de continuité

```yaml
Backup et recovery:
  - Backup DB automatique quotidien (pgdump)
  - Backup offsite (Backblaze B2 - 6€/mois en Phase 2)
  - Conservation : 30 jours
  - Test de restoration mensuel

Monitoring:
  - Uptime monitoring (Better Stack gratuit)
  - Alertes email si down > 5min
  - Logs centralisés

Contact d'urgence:
  - Numéro de téléphone d'urgence (Phase 2)
  - Email support@... (réponse < 24h)
```

---

## 13. MÉTRIQUES DE SUCCÈS

### 13.1 KPIs Phase 1 (MVP)

```typescript
Acquisition:
  - Visiteurs uniques/mois: Target 100-500
  - Sources: Direct, SEO, bouche-à-oreille

Conversion:
  - Inscriptions: Target 10-30
  - Réclamations créées: Target 5-15
  - Taux de conversion: Target 5-10%

Technique:
  - Uptime: Target 99%+
  - Temps de chargement: < 3s
  - Bugs critiques: 0

Business:
  - Réclamations soumises: 5-15
  - CA: 500-1,500€
  - Coûts: 10€
```

### 13.2 KPIs Phase 2 (Amélioration)

```typescript
Acquisition:
  - Visiteurs uniques/mois: Target 1,000-3,000
  - CAC: Target < 50€

Conversion:
  - Réclamations créées: Target 50-100
  - Taux de conversion: Target 10-15%
  - Taux d'abandon formulaire: < 30%

Qualité:
  - Taux de succès réclamations: Target 70%+
  - Délai moyen de traitement: < 90 jours
  - Satisfaction client (NPS): Target > 50

Business:
  - CA mensuel: Target 3,000-10,000€
  - Coûts: 80-200€
  - Marge: > 95%
```

### 13.3 KPIs Phase 3-4 (Scale)

```typescript
Acquisition:
  - Visiteurs uniques/mois: Target 10,000-30,000
  - CAC: Target < 30€
  - LTV/CAC ratio: > 3

Conversion:
  - Réclamations/mois: Target 300-1,000
  - Taux de conversion: Target 15-20%

Opérationnel:
  - Taux d'automatisation: > 80%
  - Temps de traitement moyen: < 60 jours
  - Taux de succès: > 75%

Business:
  - CA mensuel: Target 20,000-100,000€
  - Coûts: < 5% du CA
  - Marge nette: > 50% (après salaires)
```

---

## 14. CONCLUSION

### 14.1 Philosophie du projet

Ce cahier des charges adopte une approche **pragmatique et itérative** :

✅ **Simplicité** : Stack simple et éprouvée, pas de sur-ingénierie
✅ **Rapidité** : MVP en 2 mois, feedback rapide
✅ **Flexibilité** : Architecture permettant d'évoluer facilement
✅ **Économie** : Coûts minimisés (10€/mois en Phase 1)
✅ **Réalisme** : Pas de fausses promesses, tout est à faire

### 14.2 Facteurs clés de succès

1. **Exécution rapide** : Livrer le MVP en 2 mois maximum
2. **Feedback utilisateur** : Itérer selon les retours réels
3. **SEO dès le début** : Acquisition gratuite essentielle
4. **Qualité du service** : Taux de succès élevé = bouche-à-oreille
5. **Simplicité technique** : Facile à maintenir et faire évoluer

### 14.3 Prochaines étapes immédiates

**Semaine 1** :
1. Valider ce cahier des charges
2. Initialiser le repo Git
3. Setup Next.js + NestJS (monorepo)
4. Installer PostgreSQL local
5. Configurer Prisma

**Semaine 2** :
1. Créer schéma Prisma complet
2. Migrations initiales
3. Setup authentification JWT
4. Premières pages (landing, login, register)

**Semaine 3-4** :
1. Développer formulaire de réclamation
2. Implémenter calculateurs de compensation
3. Tests unitaires

**Semaine 5-8** :
1. Dashboard utilisateur
2. Panel admin basique
3. Emails de notification
4. Tests E2E
5. Beta privée avec 5-10 utilisateurs

### 14.4 Vision à long terme

**Année 1** : Devenir la référence pour les réclamations EU + Israël
**Année 2** : Expansion géographique (Espagne, Allemagne, UK)
**Année 3** : API B2B, partenariats OTA, app mobile mature

---

## ANNEXES

### A. Variables d'environnement

```bash
# apps/api/.env
DATABASE_URL="postgresql://indemnisation:password@localhost:5432/indemnisation"

JWT_SECRET="votre-secret-32-caracteres-minimum-securise"
JWT_REFRESH_SECRET="votre-refresh-secret-32-caracteres-minimum"
JWT_EXPIRATION="1h"
REFRESH_TOKEN_EXPIRATION="7d"

FRONTEND_URL="http://localhost:3000"

EMAIL_PROVIDER="brevo"
BREVO_API_KEY="votre-api-key"
EMAIL_FROM="noreply@votre-domaine.com"

NODE_ENV="development"
PORT=3001
```

```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### B. Scripts utiles

```bash
# Installation
npm install

# Développement
npm run dev              # Tout (web + api)
npm run dev:web          # Frontend uniquement
npm run dev:api          # Backend uniquement

# Base de données
npm run db:generate      # Générer client Prisma
npm run db:push          # Push schéma (dev)
npm run db:migrate       # Créer migration
npm run db:seed          # Seed data (aéroports)
npm run db:studio        # Interface graphique

# Tests
npm run test             # Tests unitaires
npm run test:e2e         # Tests E2E
npm run lint             # Linting
npm run type-check       # TypeScript

# Build
npm run build            # Build production

# Production (sur VPS)
npm start                # Démarrer avec PM2
```

### C. Ressources

**Documentation** :
- Next.js : https://nextjs.org/docs
- NestJS : https://docs.nestjs.com
- Prisma : https://www.prisma.io/docs
- next-intl : https://next-intl-docs.vercel.app

**Réglementations** :
- CE 261/2004 : https://europa.eu/youreurope/citizens/travel/passenger-rights/air/index_en.htm
- Loi israélienne : https://www.gov.il/en/departments/civil_aviation_authority

**Outils** :
- Hetzner : https://www.hetzner.com
- Brevo : https://www.brevo.com
- Better Stack : https://betterstack.com

---

**Document créé le** : 26 Octobre 2025
**Version** : 4.0 - Réaliste et pragmatique
**Statut** : 📝 Prêt pour développement
**Approche** : Itérative, pas à pas, zéro bullshit

**Ce cahier des charges reflète la réalité : tout est à faire, et c'est OK. On va y aller étape par étape, de manière pragmatique et réaliste.**
