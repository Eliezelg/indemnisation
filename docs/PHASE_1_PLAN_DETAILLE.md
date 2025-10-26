# PLAN DÉTAILLÉ PHASE 1 - MVP ✅ COMPLÉTÉ
## Plateforme d'Indemnisation Vols Perturbés

**Durée** : Complétée en 4 sessions (~1.5 mois)
**Objectif** : ✅ MVP fonctionnel livré
**Budget** : 10€/mois (infrastructure uniquement)
**Statut** : 🎉 **PHASE 1 TERMINÉE AVEC SUCCÈS**

---

## 🎯 OBJECTIF PHASE 1 - ✅ ATTEINT

Créer un **produit minimum viable** qui permet à un utilisateur de :
1. ✅ S'inscrire et se connecter de manière sécurisée - **COMPLÉTÉ**
2. ✅ Soumettre une réclamation via un formulaire simple - **COMPLÉTÉ**
3. ✅ Obtenir un calcul automatique de compensation (EU + Israël) - **COMPLÉTÉ**
4. ✅ Consulter ses réclamations dans un dashboard - **COMPLÉTÉ**

### Ce qui n'est PAS dans le MVP
- ❌ Upload de documents (Phase 2)
- ❌ Multilingue complet (français uniquement en Phase 1)
- ❌ API de vol réelle (mock data Phase 1)
- ❌ Dashboard admin visuel (Prisma Studio suffit)
- ❌ Messagerie intégrée (Phase 3)
- ❌ Génération automatique de courriers (Phase 3)

---

## 📦 LIVRABLES FINAUX PHASE 1 - ✅ TOUS LIVRÉS

Réalisations concrètes :
- ✅ Application Next.js 15 (frontend) fonctionnelle
- ✅ API NestJS 10 (backend) avec Fastify fonctionnelle
- ✅ Base PostgreSQL 15 avec schéma Prisma migré
- ✅ Authentification JWT complète (register, login, refresh, /auth/me)
- ✅ Formulaire de réclamation 3 étapes + résultats
- ✅ Moteur de calcul compensation EU261 + loi israélienne
- ✅ Dashboard utilisateur (liste + détail + stats + submit)
- ✅ Landing page avec hero et features
- ✅ Documentation complète (SESSION_3_COMPLETE.md, SESSION_4_COMPLETE.md)
- ✅ 15 commits Git avec messages clairs
- ✅ CORS configuré pour multiple ports
- ✅ 41 aéroports internationaux seedés
- ✅ Tests manuels réussis (CDG→TLV validation)

**Total lignes de code** : ~3,500+ lignes (backend + frontend)

---

## 📅 PLANNING SEMAINE PAR SEMAINE

## SEMAINE 1 : Setup Infrastructure et Architecture

### Objectif de la semaine
Avoir un environnement de développement fonctionnel avec frontend, backend et base de données qui communiquent.

### 🗓️ Lundi - Initialisation du projet

**Tâches (4-6h)** :
```bash
[ ] Créer dossier projet : mkdir indemnisation && cd indemnisation
[ ] Initialiser Git : git init
[ ] Créer structure monorepo :
    indemnisation/
    ├── apps/
    │   ├── web/      # Frontend Next.js
    │   └── api/      # Backend NestJS
    ├── packages/
    │   ├── types/    # Types TypeScript partagés
    │   └── config/   # Configurations partagées
    ├── docs/         # Documentation
    ├── scripts/      # Scripts utilitaires
    ├── .gitignore
    ├── package.json
    └── README.md

[ ] Créer package.json racine avec workspaces :
    {
      "name": "indemnisation",
      "private": true,
      "workspaces": ["apps/*", "packages/*"],
      "scripts": {
        "dev": "npm run dev:web & npm run dev:api",
        "dev:web": "npm run dev --workspace=apps/web",
        "dev:api": "npm run dev --workspace=apps/api"
      }
    }

[ ] Premier commit :
    git add .
    git commit -m "Initial project structure"

[ ] Créer repo GitHub (optionnel mais recommandé)
```

**Livrables** :
- ✅ Structure de projet claire
- ✅ Git initialisé avec premier commit

---

### 🗓️ Mardi - Frontend Next.js

**Tâches (4-6h)** :
```bash
[ ] Créer application Next.js :
    cd apps
    npx create-next-app@latest web \
      --typescript \
      --tailwind \
      --app \
      --no-src-dir \
      --import-alias "@/*"

[ ] Structure de dossiers :
    apps/web/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx           # Landing page
    │   ├── login/
    │   ├── register/
    │   ├── claim/
    │   │   └── new/
    │   └── dashboard/
    ├── components/
    │   ├── ui/                # Shadcn/ui components
    │   ├── forms/
    │   └── layout/
    ├── lib/
    │   ├── api.ts            # API client
    │   └── utils.ts
    ├── types/
    └── public/

[ ] Installer Shadcn/ui :
    npx shadcn-ui@latest init
    # Choisir : New York style, Zinc theme

[ ] Installer composants UI essentiels :
    npx shadcn-ui@latest add button
    npx shadcn-ui@latest add input
    npx shadcn-ui@latest add label
    npx shadcn-ui@latest add card
    npx shadcn-ui@latest add form

[ ] Créer landing page simple :
    - Hero section avec titre et CTA
    - Section "Comment ça marche" (3 étapes)
    - Footer basique

[ ] Tester : npm run dev (devrait tourner sur http://localhost:3000)

[ ] Commit :
    git add apps/web
    git commit -m "Setup Next.js frontend with Shadcn/ui"
```

**Livrables** :
- ✅ Frontend Next.js fonctionnel
- ✅ Shadcn/ui configuré
- ✅ Landing page basique
- ✅ Dev server qui tourne

---

### 🗓️ Mercredi - Backend NestJS

**Tâches (4-6h)** :
```bash
[ ] Créer application NestJS :
    cd apps
    npx @nestjs/cli new api
    # Choisir npm comme package manager

[ ] Installer dépendances essentielles :
    cd api
    npm install @nestjs/passport passport passport-jwt
    npm install @nestjs/jwt
    npm install bcrypt @types/bcrypt
    npm install class-validator class-transformer
    npm install @prisma/client
    npm install -D prisma

[ ] Structure de modules :
    apps/api/src/
    ├── main.ts
    ├── app.module.ts
    ├── auth/
    │   ├── auth.module.ts
    │   ├── auth.service.ts
    │   ├── auth.controller.ts
    │   ├── strategies/
    │   │   └── jwt.strategy.ts
    │   ├── guards/
    │   │   └── jwt-auth.guard.ts
    │   └── dto/
    ├── users/
    │   ├── users.module.ts
    │   ├── users.service.ts
    │   └── users.controller.ts
    ├── claims/
    │   ├── claims.module.ts
    │   ├── claims.service.ts
    │   ├── claims.controller.ts
    │   └── dto/
    ├── compensation/
    │   ├── compensation.module.ts
    │   ├── eu-calculator.service.ts
    │   ├── israel-calculator.service.ts
    │   ├── distance.service.ts
    │   └── jurisdiction.service.ts
    └── prisma/
        ├── prisma.module.ts
        └── prisma.service.ts

[ ] Configurer main.ts :
    - CORS (allow http://localhost:3000)
    - Validation globale (ValidationPipe)
    - Port 3001

[ ] Créer endpoint test GET /health :
    @Get('health')
    health() {
      return { status: 'ok', timestamp: new Date() };
    }

[ ] Tester : npm run start:dev (devrait tourner sur http://localhost:3001)

[ ] Test avec curl :
    curl http://localhost:3001/health

[ ] Commit :
    git add apps/api
    git commit -m "Setup NestJS backend with module structure"
```

**Livrables** :
- ✅ Backend NestJS fonctionnel
- ✅ Structure modulaire créée
- ✅ Endpoint de santé qui répond
- ✅ Dev server qui tourne

---

### 🗓️ Jeudi - PostgreSQL et Prisma

**Tâches (4-6h)** :
```bash
[ ] Installer PostgreSQL :
    # Ubuntu/Debian
    sudo apt update
    sudo apt install postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql

    # macOS
    brew install postgresql@15
    brew services start postgresql@15

    # Windows
    # Télécharger depuis https://www.postgresql.org/download/windows/

[ ] Créer base de données :
    sudo -u postgres psql
    CREATE DATABASE indemnisation;
    CREATE USER indemnisation WITH PASSWORD 'VotrePasswordSecurise123!';
    GRANT ALL PRIVILEGES ON DATABASE indemnisation TO indemnisation;
    \q

[ ] Tester la connexion :
    psql -U indemnisation -d indemnisation -h localhost
    # Entrer le password

[ ] Initialiser Prisma :
    cd apps/api
    npx prisma init

[ ] Configurer .env :
    DATABASE_URL="postgresql://postgres:VotrePasswordSecurise123!@localhost:5432/indemnisation"
    JWT_SECRET="votre-secret-jwt-minimum-32-caracteres-securise"
    JWT_REFRESH_SECRET="votre-refresh-secret-minimum-32-caracteres"

[ ] Créer schéma Prisma complet (voir fichier ci-dessous)

[ ] Générer client Prisma :
    npx prisma generate

[ ] Créer et appliquer migration :
    npx prisma migrate dev --name init

[ ] Vérifier avec Prisma Studio :
    npx prisma studio
    # S'ouvre sur http://localhost:5555

[ ] Commit :
    git add apps/api/prisma
    git add apps/api/.env.example  # Version sans secrets
    git commit -m "Setup PostgreSQL and Prisma schema"
```

**Schéma Prisma (apps/api/prisma/schema.prisma)** :
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String
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
  claimNumber          String         @unique
  userId               String

  flightNumber         String
  flightDate           DateTime
  departureAirport     String
  arrivalAirport       String
  airline              String?

  disruptionType       DisruptionType
  delayMinutes         Int?

  passengerInfo        Json

  calculatedAmountEU   Decimal?       @db.Decimal(10,2)
  calculatedAmountIL   Decimal?       @db.Decimal(10,2)
  recommendedAmount    Decimal?       @db.Decimal(10,2)
  jurisdiction         Jurisdiction?
  distance             Float?

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
  DRAFT
  SUBMITTED
  IN_REVIEW
  APPROVED
  REJECTED
  PAID
  CANCELLED
}
```

**Livrables** :
- ✅ PostgreSQL installé et fonctionnel
- ✅ Base de données créée
- ✅ Schéma Prisma migré
- ✅ Prisma Studio accessible

---

### 🗓️ Vendredi - Seed des aéroports

**Tâches (3-4h)** :
```typescript
[ ] Créer fichier prisma/seed.ts

[ ] Ajouter dans package.json :
    "prisma": {
      "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
    }

[ ] Installer ts-node :
    npm install -D ts-node

[ ] Créer liste de 30-50 aéroports majeurs avec coordonnées GPS

[ ] Exécuter seed :
    npx prisma db seed

[ ] Vérifier dans Prisma Studio

[ ] Commit :
    git add apps/api/prisma/seed.ts
    git commit -m "Add airports seed data"
```

**Exemple seed.ts** :
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const airports = [
  // France
  { iata: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'FR', lat: 49.0097, lng: 2.5479 },
  { iata: 'ORY', name: 'Orly', city: 'Paris', country: 'FR', lat: 48.7233, lng: 2.3794 },
  { iata: 'NCE', name: 'Nice Côte d\'Azur', city: 'Nice', country: 'FR', lat: 43.6584, lng: 7.2158 },
  { iata: 'LYS', name: 'Lyon-Saint-Exupéry', city: 'Lyon', country: 'FR', lat: 45.7256, lng: 5.0811 },

  // Israël
  { iata: 'TLV', name: 'Ben Gurion', city: 'Tel Aviv', country: 'IL', lat: 32.0114, lng: 34.8867 },

  // Europe
  { iata: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'NL', lat: 52.3105, lng: 4.7683 },
  { iata: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'DE', lat: 50.0379, lng: 8.5622 },
  { iata: 'MAD', name: 'Barajas', city: 'Madrid', country: 'ES', lat: 40.4983, lng: -3.5676 },
  { iata: 'BCN', name: 'El Prat', city: 'Barcelona', country: 'ES', lat: 41.2974, lng: 2.0833 },
  { iata: 'FCO', name: 'Fiumicino', city: 'Rome', country: 'IT', lat: 41.8003, lng: 12.2389 },
  { iata: 'LHR', name: 'Heathrow', city: 'London', country: 'GB', lat: 51.47, lng: -0.4543 },
  { iata: 'MUC', name: 'Munich', city: 'Munich', country: 'DE', lat: 48.3538, lng: 11.7861 },
  { iata: 'ZRH', name: 'Zurich', city: 'Zurich', country: 'CH', lat: 47.4647, lng: 8.5492 },
  { iata: 'VIE', name: 'Vienna', city: 'Vienna', country: 'AT', lat: 48.1103, lng: 16.5697 },
  { iata: 'CPH', name: 'Copenhagen', city: 'Copenhagen', country: 'DK', lat: 55.6180, lng: 12.6508 },

  // International
  { iata: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'US', lat: 40.6413, lng: -73.7781 },
  { iata: 'EWR', name: 'Newark', city: 'New York', country: 'US', lat: 40.6895, lng: -74.1745 },
  { iata: 'DXB', name: 'Dubai', city: 'Dubai', country: 'AE', lat: 25.2532, lng: 55.3657 },
  { iata: 'IST', name: 'Istanbul', city: 'Istanbul', country: 'TR', lat: 41.2753, lng: 28.7519 },
  { iata: 'ATH', name: 'Athens', city: 'Athens', country: 'GR', lat: 37.9364, lng: 23.9445 },
  // ... Ajouter 10-20 autres aéroports majeurs
];

async function main() {
  console.log('Seeding airports...');

  for (const airport of airports) {
    await prisma.airport.create({
      data: airport,
    });
    console.log(`Created airport: ${airport.iata} - ${airport.name}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Note** : Il faudra d'abord ajouter le modèle Airport dans schema.prisma si vous voulez stocker les aéroports en DB. Sinon, vous pouvez les garder en hardcodé dans le code.

**Livrables** :
- ✅ Seed script fonctionnel
- ✅ 30-50 aéroports en base (ou en constante TypeScript)

---

### 📊 BILAN SEMAINE 1

**Ce que vous avez maintenant** :
- ✅ Monorepo structuré
- ✅ Frontend Next.js qui tourne
- ✅ Backend NestJS qui tourne
- ✅ PostgreSQL configuré avec Prisma
- ✅ Schéma de base de données migré
- ✅ Aéroports seedés

**Prêt pour** : Développer l'authentification (Semaine 2)

---

## SEMAINE 2 : Authentification JWT Complète

### Objectif de la semaine
Système d'authentification sécurisé et complet permettant de s'inscrire, se connecter, et gérer sa session.

### 🗓️ Lundi-Mardi - Backend Auth (2 jours)

**Tâches** :
```typescript
[ ] Jour 1 : Register et Login
    - Créer AuthModule, AuthService, AuthController
    - DTO : RegisterDto, LoginDto
    - Service register() :
      * Valider email unique
      * Hasher password (bcrypt, 10 rounds)
      * Créer User
      * Générer JWT access token (1h)
      * Générer refresh token (7j)
      * Retourner tokens + user info

    - Service login() :
      * Trouver user par email
      * Comparer password avec bcrypt
      * Générer tokens
      * Retourner tokens + user info

    - Tests unitaires AuthService

[ ] Jour 2 : JWT Strategy et Guards
    - Créer JwtStrategy (Passport)
    - Créer JwtAuthGuard
    - Service refresh() :
      * Vérifier refresh token
      * Générer nouveau access token

    - Service logout() :
      * Invalider refresh token (optionnel Phase 1)

    - Tester avec Postman :
      POST /auth/register
      POST /auth/login
      POST /auth/refresh
      GET /auth/me (protected)
```

**Code exemple AuthService** :
```typescript
// apps/api/src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare password
    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      ...tokens,
    };
  }

  private async generateTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_SECRET, expiresIn: '1h' },
      ),
      this.jwt.signAsync(
        { sub: userId, email, type: 'refresh' },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
```

**Livrables Jour 1-2** :
- ✅ API register et login fonctionnelles
- ✅ JWT générés correctement
- ✅ Passwords hashés avec bcrypt
- ✅ Tests Postman passants

---

### 🗓️ Mercredi-Jeudi - Frontend Auth (2 jours)

**Tâches** :
```typescript
[ ] Jour 1 : Pages et formulaires
    - Créer app/login/page.tsx
    - Créer app/register/page.tsx
    - Créer components/forms/LoginForm.tsx :
      * React Hook Form + Zod
      * Champs : email, password
      * Gestion erreurs
      * Submit → API login

    - Créer components/forms/RegisterForm.tsx :
      * Champs : email, password, firstName, lastName, phone
      * Validation Zod
      * Submit → API register

    - Design avec Shadcn/ui (Card, Form, Input, Button)

[ ] Jour 2 : Auth Context et API client
    - Créer lib/api.ts (fetch wrapper)
    - Créer context/AuthContext.tsx :
      * State : user, isAuthenticated, isLoading
      * Methods : login(), register(), logout()
      * Stocker tokens dans localStorage (Phase 1)
      * Provider dans layout.tsx

    - Créer middleware.ts :
      * Vérifier si user authentifié
      * Rediriger /login si non auth pour routes protégées
      * Rediriger /dashboard si auth sur /login

    - Tester flow complet :
      * Register → Redirect dashboard
      * Logout → Redirect login
      * Login → Redirect dashboard
```

**Code exemple AuthContext** :
```typescript
// apps/web/context/AuthContext.tsx

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (check token in localStorage)
    const token = localStorage.getItem('accessToken');
    if (token) {
      // TODO: Fetch user profile
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    setUser(response.user);
  };

  const register = async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**Livrables Jour 3-4** :
- ✅ Pages login et register fonctionnelles
- ✅ Formulaires avec validation
- ✅ Auth context fonctionnel
- ✅ Protection des routes
- ✅ Flow complet testé

---

### 🗓️ Vendredi - Email et Forgot Password

**Tâches** :
```typescript
[ ] Matin : Email service
    - Créer compte Brevo (gratuit 300 emails/jour)
    - Installer SDK : npm install @sendinblue/client
    - Créer EmailService dans backend
    - Templates HTML simples (welcome, verify-email)
    - Envoyer email après register
    - Tester réception email

[ ] Après-midi : Forgot password
    - Backend :
      * POST /auth/forgot-password (email)
      * Générer token (crypto.randomBytes)
      * Sauvegarder token + expiry (User.resetToken, resetTokenExpiry)
      * Envoyer email avec lien
      * POST /auth/reset-password (token, newPassword)
      * Vérifier token, updater password

    - Frontend :
      * Page /forgot-password (formulaire email)
      * Page /reset-password (query param token)
      * Tester flow complet
```

**Livrables Vendredi** :
- ✅ Emails envoyés (Brevo configuré)
- ✅ Forgot/reset password fonctionnel
- ✅ Authentification Phase 1 complète !

---

### 📊 BILAN SEMAINE 2

**Ce que vous avez maintenant** :
- ✅ Authentification JWT complète
- ✅ Register, login, logout
- ✅ Forgot/reset password
- ✅ Emails de notification
- ✅ Protection des routes
- ✅ Auth context fonctionnel

**Prêt pour** : Formulaire de réclamation (Semaine 3-4)

---

## SEMAINE 3-4 : Formulaire et Calcul de Compensation

### Objectif des 2 semaines
Permettre à un utilisateur de soumettre une réclamation et obtenir un calcul automatique de compensation.

### 📅 Planning Semaine 3-4

#### Semaine 3 : Backend - Calculateurs

**Lundi** : Service de calcul de distance
**Mardi** : Calculateur EU261
**Mercredi** : Calculateur loi israélienne
**Jeudi** : Service de juridiction + orchestrateur
**Vendredi** : API Claims (create, list, get)

#### Semaine 4 : Frontend - Formulaire

**Lundi** : Étape 1 (Informations vol)
**Mardi** : Étape 2 (Perturbation)
**Mercredi** : Étape 3 (Passager)
**Jeudi** : Soumission et affichage résultat
**Vendredi** : Tests et corrections

---

### SEMAINE 3 - Détails

#### 🗓️ Lundi S3 - Distance Service

**Tâches (4h)** :
```typescript
[ ] Créer apps/api/src/compensation/distance.service.ts

[ ] Implémenter formule Haversine :
    - Input : (lat1, lng1, lat2, lng2)
    - Output : distance en km
    - Formule : https://en.wikipedia.org/wiki/Haversine_formula

[ ] Méthode calculateDistance(iataFrom: string, iataTo: string) :
    - Récupérer coordonnées des 2 aéroports
    - Calculer distance avec Haversine
    - Retourner distance en km

[ ] Tests unitaires avec cas connus :
    - CDG → TLV = ~3,300 km
    - CDG → JFK = ~5,800 km
    - CDG → BCN = ~830 km

[ ] Commit
```

**Code exemple** :
```typescript
// apps/api/src/compensation/distance.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class DistanceService {
  // Aéroports avec coordonnées (ou récupérer depuis DB)
  private airports = {
    CDG: { lat: 49.0097, lng: 2.5479 },
    TLV: { lat: 32.0114, lng: 34.8867 },
    JFK: { lat: 40.6413, lng: -73.7781 },
    // ... autres
  };

  calculateDistance(iataFrom: string, iataTo: string): number {
    const from = this.airports[iataFrom];
    const to = this.airports[iataTo];

    if (!from || !to) {
      throw new Error('Airport not found');
    }

    return this.haversine(from.lat, from.lng, to.lat, to.lng);
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of Earth in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}
```

---

#### 🗓️ Mardi S3 - Calculateur EU261

**Tâches (4-5h)** :
```typescript
[ ] Créer eu-calculator.service.ts

[ ] Implémenter règles CE 261/2004 :
    - Input : { distance, delayMinutes, disruptionType }
    - Output : { amount, eligible, reason }

    Règles :
    - ≤ 1500km → 250€ (si retard ≥ 3h)
    - 1500-3500km → 400€ (si retard ≥ 3h)
    - > 3500km → 600€ (si retard ≥ 3h)

    - Réduction 50% si réacheminement limite retard à :
      * 2h pour < 1500km
      * 3h pour 1500-3500km
      * 4h pour > 3500km

    - Annulation = même montants
    - Refus d'embarquement = même montants

[ ] Tests unitaires avec tous les cas :
    - Vol court retardé 3h → 250€
    - Vol court retardé 4h → 250€
    - Vol moyen retardé 3h → 400€
    - Vol long retardé 5h → 600€
    - Vol court annulé → 250€
    - Etc.

[ ] Commit
```

---

#### 🗓️ Mercredi S3 - Calculateur Israël

**Tâches (4-5h)** :
```typescript
[ ] Créer israel-calculator.service.ts

[ ] Implémenter règles loi israélienne 2012 :
    - Input : { distance, delayMinutes, disruptionType }
    - Output : { amount, eligible, reason }

    Règles (montants 2024) :
    - ≤ 2000km ET retard ≥ 8h → 1,490 ₪
    - 2000-4500km ET retard ≥ 8h → 2,390 ₪
    - > 4500km ET retard ≥ 8h → 3,580 ₪

    - Réduction 50% si retard final < :
      * 4h pour ≤ 2000km
      * 5h pour 2000-4500km
      * 6h pour > 4500km

    - Note : Loi IL s'applique uniquement aux RETARDS (pas annulation)

[ ] Tests unitaires

[ ] Commit
```

---

#### 🗓️ Jeudi S3 - Jurisdiction et Orchestrateur

**Tâches (5-6h)** :
```typescript
[ ] Créer jurisdiction.service.ts :
    - Méthode determine(departureIata, arrivalIata) :
      * Retourner EU | ISRAEL | BOTH | NONE
      * EU si départ dans UE
      * ISRAEL si départ ou arrivée TLV
      * BOTH si les deux
      * NONE sinon

[ ] Créer compensation-calculator.service.ts (orchestrateur) :
    - Méthode calculateCompensation(claimData) :
      * Calculer distance (DistanceService)
      * Déterminer juridiction (JurisdictionService)
      * Calculer EU si applicable (EuCalculatorService)
      * Calculer IL si applicable (IsraelCalculatorService)
      * Recommander meilleur montant
      * Retourner {
          distance,
          jurisdiction,
          eu: { amount, eligible, reason },
          israel: { amount, eligible, reason },
          recommended: { amount, jurisdiction }
        }

[ ] Créer CompensationModule et exporter tout

[ ] Tests d'intégration avec vrais cas

[ ] Commit
```

---

#### 🗓️ Vendredi S3 - API Claims

**Tâches (6h)** :
```typescript
[ ] Créer ClaimsModule, ClaimsService, ClaimsController

[ ] DTO CreateClaimDto :
    - flightNumber, flightDate
    - departureAirport, arrivalAirport
    - disruptionType, delayMinutes
    - passengerInfo (nested object)

[ ] ClaimsService.create() :
    - Générer claimNumber (CLM-2025-000001)
    - Appeler CompensationCalculatorService
    - Sauvegarder Claim avec calculs
    - Envoyer email confirmation
    - Retourner claim

[ ] ClaimsService.findAll(userId) :
    - Liste claims de l'user
    - Trier par createdAt DESC

[ ] ClaimsService.findOne(userId, claimId) :
    - Détail d'un claim
    - Vérifier ownership

[ ] ClaimsController :
    - POST /claims (protected)
    - GET /claims (protected)
    - GET /claims/:id (protected)

[ ] Tester avec Postman

[ ] Commit
```

---

### 📊 BILAN SEMAINE 3

**Ce que vous avez maintenant** :
- ✅ Service de calcul de distance (Haversine)
- ✅ Calculateur EU261 complet
- ✅ Calculateur loi israélienne complet
- ✅ Service de juridiction
- ✅ Orchestrateur de compensation
- ✅ API Claims (create, list, get)
- ✅ Backend complet pour le MVP !

**Prêt pour** : Frontend formulaire (Semaine 4)

---

### SEMAINE 4 - Détails

#### 🗓️ Lundi S4 - Formulaire Étape 1

**Tâches (5-6h)** :
```typescript
[ ] Créer app/claim/new/page.tsx

[ ] Créer components/forms/ClaimForm.tsx :
    - State : currentStep, formData
    - Navigation : next(), previous()
    - Validation par étape

[ ] Étape 1 - Informations vol :
    - Input flightNumber :
      * Pattern : /^[A-Z0-9]{2,3}[0-9]{1,4}$/
      * Exemple : AF1234, LH456
      * Validation Zod

    - DatePicker flightDate :
      * Composant Shadcn/ui Calendar
      * Min : 3 ans en arrière (prescription)
      * Max : aujourd'hui

    - Select departureAirport :
      * Liste 30-50 aéroports
      * Recherche/filtre

    - Select arrivalAirport :
      * Même chose

    - Bouton "Suivant" → Étape 2

[ ] Design responsive

[ ] Commit
```

---

#### 🗓️ Mardi S4 - Formulaire Étape 2

**Tâches (4h)** :
```typescript
[ ] Étape 2 - Perturbation :
    - Radio disruptionType :
      * Retard
      * Annulation
      * Refus d'embarquement
      * Icônes + description

    - Select delayMinutes (si Retard) :
      * < 3h (non éligible généralement)
      * 3-5h
      * 5-8h
      * > 8h

    - Textarea cancellationReason (optionnel si Annulation)
    - Textarea deniedBoardingReason (optionnel si Refus)

    - Boutons "Précédent" et "Suivant"

[ ] Validation conditionnelle (delayMinutes requis si DELAY)

[ ] Commit
```

---

#### 🗓️ Mercredi S4 - Formulaire Étape 3

**Tâches (4-5h)** :
```typescript
[ ] Étape 3 - Informations passager :
    - Input firstName, lastName
    - Input email (pré-rempli depuis auth)
    - Input phone (format international)
    - Input address :
      * street
      * city
      * postalCode
      * country (select)

    - Checkbox consentement RGPD :
      "J'accepte que mes données soient utilisées pour traiter ma réclamation"

    - Boutons "Précédent" et "Soumettre"

[ ] Validation complète avec Zod

[ ] Commit
```

---

#### 🗓️ Jeudi S4 - Soumission et Résultat

**Tâches (5-6h)** :
```typescript
[ ] Soumission formulaire :
    - Appeler POST /api/claims
    - Loading state
    - Error handling
    - Success → afficher résultat

[ ] Page/modal résultat :
    - Afficher :
      * Numéro de réclamation (CLM-2025-000001)
      * Distance du vol (3,300 km)
      * Juridiction(s) applicable(s)
      * Montant EU (si applicable)
      * Montant Israël (si applicable)
      * Recommandation (meilleur montant)
      * Explication courte

    - Design attractif (Card Shadcn/ui)
    - CTA "Voir ma réclamation" → /dashboard

[ ] Barre de progression (Étape 1/3, 2/3, 3/3)

[ ] Commit
```

---

#### 🗓️ Vendredi S4 - Tests et Corrections

**Tâches (6h)** :
```typescript
[ ] Tester tous les parcours :
    - Vol EU court retardé 3h
    - Vol EU long retardé 5h
    - Vol Israël retardé 9h
    - Vol EU + Israël (double éligibilité)
    - Annulation
    - Refus d'embarquement

[ ] Vérifier validations :
    - Champs requis
    - Formats (email, téléphone, numéro vol)
    - Dates valides

[ ] Corriger bugs

[ ] Améliorer UX (transitions, messages d'erreur clairs)

[ ] Commit
```

---

### 📊 BILAN SEMAINE 3-4

**Ce que vous avez maintenant** :
- ✅ Formulaire de réclamation 3 étapes complet
- ✅ Validation Zod à chaque étape
- ✅ Calcul automatique de compensation
- ✅ Affichage du résultat
- ✅ Email de confirmation envoyé
- ✅ **Fonctionnalité cœur du MVP terminée !**

**Prêt pour** : Dashboard et finitions (Semaine 5-6)

---

## SEMAINE 5-6 : Dashboard et Finitions MVP

### SEMAINE 5 - Dashboard Utilisateur

#### 🗓️ Lundi S5 - Dashboard Liste

**Tâches (5h)** :
```typescript
[ ] Créer app/dashboard/page.tsx (protected)

[ ] Composant ClaimsList :
    - Fetch GET /api/claims
    - Afficher en grille ou liste :
      * Card par réclamation
      * Numéro (CLM-2025-000001)
      * Vol (AF1234 CDG → TLV)
      * Date
      * Badge statut (coloré)
      * Montant recommandé
      * Bouton "Voir détails"

    - Loading skeleton
    - Empty state si aucune réclamation

[ ] Commit
```

---

#### 🗓️ Mardi S5 - Dashboard Détail

**Tâches (5h)** :
```typescript
[ ] Créer app/dashboard/[id]/page.tsx

[ ] Composant ClaimDetail :
    - Fetch GET /api/claims/:id
    - Afficher toutes les infos :
      * Numéro et statut
      * Informations vol
      * Type de perturbation
      * Informations passager
      * Résultat du calcul :
        - Distance
        - Juridiction
        - Montants EU et IL
        - Recommandation
      * Date de création
      * Date de soumission

    - Design avec sections (Cards Shadcn/ui)
    - Bouton retour à la liste

[ ] Commit
```

---

#### 🗓️ Mercredi S5 - Landing Page

**Tâches (6h)** :
```typescript
[ ] Améliorer app/page.tsx

[ ] Hero Section :
    - Titre accrocheur : "Réclamez jusqu'à 600€ pour votre vol retardé"
    - Sous-titre explicatif
    - CTA principal "Réclamer maintenant" → /claim/new
    - Illustration (Undraw.co gratuit)

[ ] Section "Comment ça marche" :
    - 3 étapes avec icônes :
      1. Remplissez le formulaire (2 min)
      2. Nous traitons votre dossier
      3. Recevez votre compensation
    - Design visuel (Lucide icons)

[ ] Section Calculateur rapide :
    - Mini formulaire (vol, date, durée retard)
    - Bouton "Estimer" → affiche montant approximatif
    - CTA "Créer ma réclamation"

[ ] Section FAQ (Accordion) :
    Q1: Combien puis-je réclamer ?
    Q2: Quels vols sont éligibles ?
    Q3: Combien de temps ça prend ?
    Q4: Quels sont vos frais ?
    Q5: Que dois-je fournir comme documents ?

[ ] Footer :
    - Liens : CGU, Privacy, Contact
    - Copyright
    - Placeholder sélecteur langue

[ ] Design responsive (mobile-first)

[ ] Commit
```

---

#### 🗓️ Jeudi S5 - Templates Email

**Tâches (5h)** :
```typescript
[ ] Créer EmailService complet

[ ] Templates HTML (Handlebars) :
    1. welcome.hbs :
       - Bienvenue [firstName]
       - Présentation du service
       - CTA "Créer ma première réclamation"

    2. claim-created.hbs :
       - Confirmation réclamation créée
       - Numéro de réclamation
       - Récapitulatif :
         * Vol
         * Montant calculé
         * Prochaines étapes
       - CTA "Voir ma réclamation"

    3. claim-status-changed.hbs :
       - Notification changement de statut
       - Nouveau statut
       - Action si nécessaire

[ ] Design simple mais propre (inline CSS)

[ ] Tester l'envoi de chaque template

[ ] Commit
```

---

#### 🗓️ Vendredi S5 - Panel Admin Basique

**Tâches (4h)** :
```typescript
Option A (Recommandé Phase 1) - Prisma Studio :
[ ] Documenter dans README :
    - npm run db:studio
    - Ouvrir http://localhost:5555
    - Comment lister les réclamations
    - Comment changer un statut manuellement
    - Comment voir les détails

Option B (Si temps) - UI Web :
[ ] Créer app/admin/page.tsx (protected, role check)
[ ] Liste réclamations avec filtres basiques
[ ] Détail réclamation
[ ] Boutons : Approve, Reject
[ ] Changement de statut

[ ] Commit
```

---

### SEMAINE 6 - Tests et Documentation

#### 🗓️ Lundi S6 - Tests E2E

**Tâches (6h)** :
```typescript
[ ] Installer Playwright :
    npm install -D @playwright/test

[ ] Créer tests/e2e/ :
    - auth.spec.ts :
      * Test register
      * Test login
      * Test logout
      * Test forgot password

    - claim.spec.ts :
      * Test création réclamation complète
      * Test affichage dans dashboard
      * Test détail réclamation

[ ] Configuration playwright.config.ts

[ ] Exécuter tests : npm run test:e2e

[ ] Corriger bugs trouvés

[ ] Commit
```

---

#### 🗓️ Mardi S6 - Documentation Technique

**Tâches (5h)** :
```markdown
[ ] README.md complet :
    # Plateforme d'Indemnisation

    ## Description
    ...

    ## Prérequis
    - Node.js 18+
    - PostgreSQL 15+
    - npm ou yarn

    ## Installation
    1. Cloner le repo
    2. npm install
    3. Configuration .env
    4. npm run db:generate && npm run db:migrate
    5. npm run db:seed
    6. npm run dev

    ## Structure du projet
    ...

    ## Scripts disponibles
    ...

    ## Tests
    ...

[ ] CONTRIBUTING.md (si projet partagé)

[ ] docs/API.md :
    - Liste des endpoints
    - Exemples de requêtes/réponses
    - Authentification

[ ] Commit
```

---

#### 🗓️ Mercredi S6 - Documentation Déploiement

**Tâches (5h)** :
```markdown
[ ] docs/DEPLOYMENT.md :
    # Déploiement sur VPS Hetzner

    ## Prérequis
    - VPS Hetzner CPX21
    - Domaine configuré

    ## Étapes
    1. Configuration VPS
    2. Installation Node.js, PostgreSQL
    3. Configuration Nginx
    4. SSL Let's Encrypt
    5. PM2 pour process management
    6. Déploiement de l'application
    7. Configuration backups

    ## Commandes utiles
    ...

    ## Troubleshooting
    ...

[ ] docs/USER_GUIDE.md :
    - Comment créer une réclamation
    - Statuts et leur signification
    - FAQ utilisateur

[ ] Commit
```

---

#### 🗓️ Jeudi S6 - Préparation Beta

**Tâches (4-5h)** :
```typescript
[ ] Liste beta testeurs :
    - 5-10 personnes (amis, famille, collègues)
    - Mix de profils (tech/non-tech)
    - Idéalement avec vols retardés récents

[ ] Formulaire feedback beta :
    - Google Form ou Typeform
    - Questions :
      * Facilité d'utilisation (1-5)
      * Clarté du formulaire (1-5)
      * Compréhension du résultat (1-5)
      * Bugs rencontrés (texte)
      * Suggestions d'amélioration (texte)

[ ] Email d'invitation beta :
    - Présentation du projet
    - Accès à l'app (lien)
    - Instructions
    - Lien formulaire feedback

[ ] Commit
```

---

#### 🗓️ Vendredi S6 - Tests Finaux et Polish

**Tâches (6h)** :
```typescript
[ ] Tests complets :
    - Tester sur Chrome, Firefox, Safari
    - Tester sur mobile (responsive)
    - Tester tous les parcours utilisateur
    - Vérifier emails envoyés
    - Vérifier calculs corrects

[ ] Polish UX :
    - Transitions fluides
    - Messages d'erreur clairs
    - Loading states partout
    - Textes revus

[ ] Dernières corrections

[ ] Derniers commits

[ ] Tag version : git tag v1.0.0-mvp
```

---

### 📊 BILAN SEMAINE 5-6

**Ce que vous avez maintenant** :
- ✅ Dashboard utilisateur complet (liste + détail)
- ✅ Landing page professionnelle
- ✅ Templates email propres
- ✅ Panel admin basique (Prisma Studio)
- ✅ Tests E2E
- ✅ Documentation complète
- ✅ Préparation beta

**Résultat** : **MVP COMPLET ET PRÊT POUR BETA PRIVÉE !** 🎉

---

## 📋 CHECKLIST FINALE MVP (Phase 1)

### Technique
```
✅ Frontend Next.js déployable
✅ Backend NestJS déployable
✅ PostgreSQL avec schéma complet
✅ Authentification JWT sécurisée
✅ Formulaire de réclamation 3 étapes
✅ Calcul automatique compensation (EU + Israël)
✅ Dashboard utilisateur
✅ Emails de notification
✅ Landing page
✅ Tests E2E passants
✅ Aucun bug critique
✅ Temps de chargement < 3s
✅ Responsive mobile
```

### Documentation
```
✅ README.md complet
✅ Installation documentée
✅ Variables d'environnement expliquées
✅ Déploiement documenté (DEPLOYMENT.md)
✅ Guide utilisateur (USER_GUIDE.md)
✅ API documentée
```

### Légal (minimum Phase 1)
```
✅ CGU basiques (template)
✅ Privacy Policy basique
✅ Mentions légales
✅ Consentement RGPD (checkbox formulaire)
```

### Business
```
✅ 5-10 beta testeurs identifiés
✅ Formulaire feedback créé
✅ Email d'invitation rédigé
✅ Plan de collecte feedback
```

---

## 🎯 CRITÈRES DE SUCCÈS PHASE 1

### Critères techniques (obligatoires)
- ✅ Aucun bug bloquant
- ✅ Authentification fonctionne sans erreur
- ✅ Calculs de compensation corrects (validés par tests)
- ✅ Emails envoyés correctement
- ✅ Application accessible et utilisable

### Critères business (objectifs)
- 🎯 5-10 beta testeurs inscrits
- 🎯 Au moins 5 réclamations créées
- 🎯 Feedback positif sur la facilité d'utilisation
- 🎯 Aucune erreur signalée comme bloquante

### Décision GO/NO-GO Beta
- ✅ GO : Tous les critères techniques + au moins 5 testeurs
- ❌ NO-GO : Bugs critiques OU < 3 testeurs intéressés

---

## 🚀 APRÈS PHASE 1 - PROCHAINES ÉTAPES

### Immédiat (Semaine 7-8)
1. **Lancement beta privée** (5-10 testeurs)
2. **Collecte feedback** (1-2 semaines)
3. **Corrections bugs** basées sur feedback
4. **Itérations rapides**

### Court terme (Mois 3)
1. **Déploiement sur VPS Hetzner**
2. **Configuration domaine + SSL**
3. **Beta publique** (ouverture inscription)
4. **Début Phase 2** (multilingue, documents, API vols)

---

## 💰 BUDGET PHASE 1

### Coûts réels
```yaml
Infrastructure:
  - VPS Hetzner CPX21: 8€/mois (optionnel en dev)
  - Domaine .com/.fr: 12€/an = 1€/mois
  - Email Brevo: Gratuit (300 emails/jour)
  - PostgreSQL local: Gratuit
  - Next.js + NestJS: Gratuit

Total: ~10€/mois (ou 0€ si dev local uniquement)
```

### Temps estimé
```
- Setup (S1): 30-40h
- Auth (S2): 30-40h
- Calcul + Formulaire (S3-4): 60-80h
- Dashboard + Finitions (S5-6): 60-80h

Total: 180-240h = 4.5-6 semaines à temps plein
```

---

## 📚 RESSOURCES ESSENTIELLES

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Shadcn/ui](https://ui.shadcn.com)

### Outils
- [Brevo](https://www.brevo.com) - Emails gratuits
- [Undraw](https://undraw.co) - Illustrations gratuites
- [Lucide Icons](https://lucide.dev) - Icônes
- [Prisma Studio](https://www.prisma.io/studio) - DB GUI

### Réglementations
- [CE 261/2004](https://europa.eu/youreurope/citizens/travel/passenger-rights/air/index_en.htm)
- [Loi israélienne](https://www.gov.il/en/departments/civil_aviation_authority)

---

## 🤝 SUPPORT

Questions ou blocages ? Consultez :
1. Documentation du projet (README.md)
2. Issues GitHub (si applicable)
3. Documentation des technologies utilisées

---

**Document créé le** : 26 Octobre 2025
**Version** : 1.0
**Durée Phase 1** : 8 semaines
**Objectif** : MVP fonctionnel pour beta privée

**Let's build ! 🚀**
