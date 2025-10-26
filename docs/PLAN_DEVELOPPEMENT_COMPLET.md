# PLAN DE DÉVELOPPEMENT COMPLET
## Plateforme d'Indemnisation Vols Perturbés

**Date** : 26 Octobre 2025
**Version** : 1.0
**Basé sur** : Cahier des charges V4 Réaliste

---

## 🎯 OBJECTIF GLOBAL

Développer une plateforme web fonctionnelle permettant aux passagers de réclamer des indemnisations pour vols perturbés, en 4 phases progressives sur 12 mois.

---

## 📊 VUE D'ENSEMBLE DES PHASES

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  PHASE 1 (M1-2)     PHASE 2 (M3-4)     PHASE 3 (M5-6)    PHASE 4 (M7-12)│
│  ═════════════      ═════════════      ═════════════     ════════════════│
│  MVP Essentiel      Amélioration       Automatisation   Scale & Growth  │
│                                                                           │
│  • Auth             • Multilingue      • PDF auto       • Espagnol      │
│  • Formulaire       • Documents        • Dashboard++    • API B2B       │
│  • Calcul auto      • API vols         • Messagerie     • Mobile        │
│  • Dashboard        • Admin UI         • Optimisation   • ML/AI         │
│                                                                           │
│  Budget: 10€/mois   Budget: 80€/mois   Budget: 80€/mois Budget: 220€/m │
│  Target: 10 claims  Target: 50 claims  Target: 150 clms Target: 500    │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## PHASE 1 : MVP ESSENTIEL (Semaines 1-8)

### 🎯 Objectif Phase 1
Créer un produit minimum viable qui permet à un utilisateur de :
1. S'inscrire et se connecter
2. Soumettre une réclamation (formulaire simple)
3. Obtenir un calcul automatique de compensation
4. Voir ses réclamations dans un dashboard basique

### 📦 Livrables Phase 1
- ✅ Application Next.js + NestJS fonctionnelle
- ✅ Base de données PostgreSQL configurée
- ✅ Authentification JWT complète
- ✅ Formulaire de réclamation 3 étapes
- ✅ Moteur de calcul EU261 + Israël
- ✅ Dashboard utilisateur basique
- ✅ Emails de notification basiques
- ✅ Panel admin minimal (CLI ou Prisma Studio)

### 📅 Planning détaillé Phase 1

#### **SEMAINE 1-2 : Setup et Infrastructure**

**Objectif** : Avoir un environnement de développement fonctionnel et structuré.

**Jour 1-2 : Initialisation du projet**
```bash
# Tâches
[ ] Créer le dossier projet
[ ] Initialiser Git
[ ] Créer structure monorepo
    /apps
      /web      (Next.js frontend)
      /api      (NestJS backend)
    /packages
      /types    (Types partagés)
      /config   (Configs partagées)
    /docs
    /scripts

[ ] Initialiser package.json racine
[ ] Configurer Turborepo ou Nx (optionnel, ou simple npm workspaces)
[ ] Premier commit
```

**Jour 3-4 : Frontend Next.js**
```bash
[ ] npx create-next-app@latest apps/web --typescript --tailwind --app
[ ] Configurer tailwind.config.js
[ ] Installer Shadcn/ui (npx shadcn-ui@latest init)
[ ] Créer structure de dossiers :
    app/
      [locale]/
        page.tsx
        layout.tsx
    components/
      ui/
      forms/
    lib/
    types/

[ ] Créer première page (landing page simple)
[ ] Tester que tout fonctionne (npm run dev)
```

**Jour 5-6 : Backend NestJS**
```bash
[ ] npx @nestjs/cli new apps/api
[ ] Installer dépendances essentielles :
    - @nestjs/passport passport passport-jwt
    - @nestjs/jwt
    - bcrypt @types/bcrypt
    - class-validator class-transformer
    - @prisma/client prisma

[ ] Créer structure de modules :
    src/
      auth/
      users/
      claims/
      compensation/
      common/
      prisma/

[ ] Configurer main.ts (CORS, validation, etc.)
[ ] Tester que l'API démarre (npm run start:dev)
```

**Jour 7-8 : PostgreSQL + Prisma**
```bash
[ ] Installer PostgreSQL localement :
    Ubuntu: sudo apt install postgresql
    macOS: brew install postgresql
    Windows: Télécharger depuis postgresql.org

[ ] Créer base de données :
    sudo -u postgres psql
    CREATE DATABASE indemnisation;
    CREATE USER indemnisation WITH PASSWORD 'votre_password';
    GRANT ALL ON DATABASE indemnisation TO indemnisation;

[ ] Initialiser Prisma :
    cd apps/api
    npx prisma init

[ ] Créer schéma Prisma (User, Claim)
[ ] Générer client : npx prisma generate
[ ] Créer et appliquer migration : npx prisma migrate dev --name init
[ ] Seed des aéroports : créer prisma/seed.ts
[ ] Tester avec Prisma Studio : npx prisma studio
```

**Livrables Semaine 1-2** :
- ✅ Repo Git avec structure claire
- ✅ Frontend Next.js qui tourne sur localhost:3000
- ✅ Backend NestJS qui tourne sur localhost:3001
- ✅ PostgreSQL avec schéma Prisma migré
- ✅ Documentation de setup dans README.md

---

#### **SEMAINE 3-4 : Authentification Complète**

**Objectif** : Système d'authentification JWT fonctionnel et sécurisé.

**Jour 1-2 : Backend - API Auth**
```typescript
[ ] Créer AuthModule, AuthService, AuthController
[ ] Implémenter register :
    - Valider email/password
    - Hasher password (bcrypt)
    - Créer User dans DB
    - Retourner tokens JWT

[ ] Implémenter login :
    - Vérifier credentials
    - Générer access token (1h)
    - Générer refresh token (7j)
    - Retourner tokens + user info

[ ] Implémenter refresh :
    - Vérifier refresh token
    - Générer nouveau access token
    - Retourner nouveau token

[ ] Créer JwtStrategy pour Passport
[ ] Créer JwtAuthGuard
[ ] Créer DTOs (RegisterDto, LoginDto)
[ ] Tests unitaires AuthService
```

**Jour 3-4 : Frontend - Pages Auth**
```typescript
[ ] Créer app/[locale]/(auth)/login/page.tsx
[ ] Créer app/[locale]/(auth)/register/page.tsx
[ ] Créer composants :
    - LoginForm (React Hook Form + Zod)
    - RegisterForm (React Hook Form + Zod)

[ ] Créer lib/api.ts (fetch wrapper avec tokens)
[ ] Créer context AuthContext :
    - State : user, isAuthenticated, isLoading
    - Methods : login(), register(), logout(), refreshToken()

[ ] Implémenter login flow complet
[ ] Implémenter register flow complet
[ ] Stocker tokens dans cookies httpOnly (via API route)
[ ] Créer middleware.ts pour protection routes
```

**Jour 5 : Email de vérification**
```typescript
[ ] Backend : Créer système d'envoi email
    - Installer nodemailer ou utiliser Brevo SDK
    - Créer EmailService
    - Template email de vérification

[ ] Ajouter champ emailVerified à User
[ ] Créer endpoint POST /auth/verify-email
[ ] Envoyer email après register
[ ] Page frontend /verify-email?token=xxx
```

**Jour 6-7 : Mot de passe oublié**
```typescript
[ ] Backend :
    - POST /auth/forgot-password (envoie email)
    - POST /auth/reset-password (avec token)
    - Créer table PasswordReset ou ajouter champ User

[ ] Frontend :
    - Page /forgot-password (formulaire email)
    - Page /reset-password?token=xxx (nouveau MDP)

[ ] Tester flow complet
```

**Jour 8 : Tests et sécurité**
```bash
[ ] Ajouter rate limiting (nestjs/throttler)
[ ] Configurer CORS correctement
[ ] Ajouter Helmet pour headers sécurité
[ ] Tests E2E auth flow (register → login → protected route)
[ ] Documentation API (Swagger optionnel)
```

**Livrables Semaine 3-4** :
- ✅ Authentification JWT complète et sécurisée
- ✅ Pages login, register fonctionnelles
- ✅ Protection des routes frontend et backend
- ✅ Email de vérification
- ✅ Forgot/reset password
- ✅ Tests passants

---

#### **SEMAINE 5-6 : Formulaire de Réclamation**

**Objectif** : Permettre à un utilisateur de soumettre une réclamation et obtenir un calcul de compensation.

**Jour 1-2 : Backend - Calculateurs de compensation**
```typescript
[ ] Créer CompensationModule
[ ] Créer EuCalculatorService :
    - Méthode calculate(distance, delayMinutes, disruptionType)
    - Règles CE 261/2004
    - Retourner { amount, eligible, reason }

[ ] Créer IsraelCalculatorService :
    - Méthode calculate(distance, delayMinutes, disruptionType)
    - Règles loi israélienne
    - Retourner { amount, eligible, reason }

[ ] Créer DistanceService :
    - Méthode calculate(iataFrom, iataTo)
    - Formule Haversine
    - Retourner distance en km

[ ] Créer JurisdictionService :
    - Méthode determine(departureIata, arrivalIata)
    - Retourner EU | ISRAEL | BOTH | NONE

[ ] Créer CompensationCalculatorService (orchestrateur) :
    - Méthode calculateCompensation(claimData)
    - Appelle tous les services ci-dessus
    - Retourne { eu, israel, recommended }

[ ] Tests unitaires pour tous les calculateurs
```

**Jour 3 : Backend - API Claims**
```typescript
[ ] Créer ClaimsModule
[ ] Créer CreateClaimDto :
    - flightNumber, flightDate
    - departureAirport, arrivalAirport
    - disruptionType, delayMinutes
    - passengerInfo (JSON)

[ ] Créer ClaimsService :
    - create(userId, createClaimDto)
    - findAll(userId)
    - findOne(userId, claimId)

[ ] Créer ClaimsController :
    - POST /claims (protected by JwtAuthGuard)
    - GET /claims (liste des claims de l'user)
    - GET /claims/:id

[ ] Dans create() :
    - Générer claimNumber (CLM-2025-000001)
    - Calculer compensation
    - Sauvegarder en DB
    - Envoyer email confirmation
```

**Jour 4-5 : Frontend - Formulaire multi-étapes**
```typescript
[ ] Créer page app/[locale]/claim/new/page.tsx

[ ] Créer composant MultiStepForm :
    - State : currentStep, formData
    - Navigation : next(), previous(), goToStep()

[ ] Étape 1 : Informations de vol
    - Input flightNumber (validation format IATA)
    - DatePicker flightDate
    - Select departureAirport (30 aéroports hardcodés)
    - Select arrivalAirport
    - Validation Zod

[ ] Étape 2 : Perturbation
    - Radio disruptionType (Delay, Cancellation, Denied Boarding)
    - Select delayMinutes (si Delay)
    - Validation

[ ] Étape 3 : Passager
    - Input firstName, lastName
    - Input email, phone
    - Input address (street, city, postalCode, country)
    - Validation

[ ] Barre de progression
[ ] Boutons Previous/Next
[ ] Soumission finale
```

**Jour 6 : Frontend - Résultat du calcul**
```typescript
[ ] Après soumission, afficher résultat :
    - Montant EU (si applicable)
    - Montant Israël (si applicable)
    - Recommandation (meilleur montant)
    - Distance du vol
    - Juridiction

[ ] Design de la card de résultat (Shadcn/ui)
[ ] Bouton "Voir ma réclamation"
[ ] Redirection vers dashboard
```

**Jour 7 : Seed des aéroports**
```typescript
[ ] Créer prisma/seed.ts
[ ] Ajouter 30-50 aéroports majeurs :
    - Code IATA, nom, ville, pays
    - Coordonnées GPS (lat, lng)
    - Focus : EU + Israël + internationaux majeurs

[ ] Exemples :
    FR: CDG, ORY, NCE, LYS
    IL: TLV
    EU: AMS, FRA, MAD, BCN, FCO, LHR, etc.
    International: JFK, DXB, IST, etc.

[ ] Exécuter seed : npx prisma db seed
```

**Jour 8 : Tests et debug**
```bash
[ ] Tester formulaire complet
[ ] Tester tous les cas de calcul :
    - Vol EU court (< 1500km)
    - Vol EU moyen (1500-3500km)
    - Vol EU long (> 3500km)
    - Vol Israël
    - Vol EU + Israël (double éligibilité)

[ ] Vérifier validation
[ ] Vérifier email de confirmation
[ ] Corriger bugs
```

**Livrables Semaine 5-6** :
- ✅ Formulaire de réclamation fonctionnel (3 étapes)
- ✅ Calcul automatique de compensation (EU + Israël)
- ✅ Email de confirmation
- ✅ Base d'aéroports seedée
- ✅ Tests de calcul validés

---

#### **SEMAINE 7-8 : Dashboard et Finitions MVP**

**Objectif** : Terminer le MVP avec dashboard utilisateur, landing page, et préparer pour beta.

**Jour 1-2 : Dashboard utilisateur**
```typescript
[ ] Créer page app/[locale]/dashboard/page.tsx (protected)

[ ] Composant ClaimsList :
    - Fetch GET /api/claims
    - Afficher liste avec :
      - Numéro (CLM-2025-000001)
      - Vol (AF1234)
      - Date
      - Statut (badge coloré)
      - Montant calculé
    - Filtres par statut (optionnel Phase 1)

[ ] Composant ClaimDetail :
    - Fetch GET /api/claims/:id
    - Afficher toutes les informations
    - Afficher résultat du calcul
    - Statut actuel
    - Bouton "Modifier" si DRAFT (optionnel Phase 1)

[ ] Design responsive (desktop + mobile)
[ ] Loading states
[ ] Empty state (aucune réclamation)
```

**Jour 3-4 : Landing page**
```typescript
[ ] Créer app/[locale]/page.tsx

[ ] Section Hero :
    - Titre accrocheur
    - Sous-titre explicatif
    - CTA "Réclamer maintenant" → /claim/new
    - Image ou illustration

[ ] Section "Comment ça marche" :
    - 3 étapes visuelles :
      1. Remplir le formulaire
      2. Nous nous occupons du reste
      3. Recevez votre compensation
    - Icônes + texte court

[ ] Section "Calculateur rapide" :
    - Mini formulaire (vol, date, type)
    - Bouton "Estimer" → affiche montant approximatif
    - CTA "Créer ma réclamation"

[ ] Section FAQ :
    - 5-10 questions/réponses basiques
    - Accordion (Shadcn/ui)

[ ] Footer :
    - Liens : CGU, Privacy Policy, Contact
    - Sélecteur de langue (FR uniquement en Phase 1)
    - Copyright

[ ] Design professionnel avec Tailwind
```

**Jour 5 : Panel admin basique**
```typescript
Option A (Simple - recommandé Phase 1) :
[ ] Utiliser Prisma Studio : npx prisma studio
[ ] Documenter comment :
    - Lister les réclamations
    - Voir détail
    - Changer statut manuellement
    - Filtrer par statut

Option B (UI web basique) :
[ ] Créer app/[locale]/admin/page.tsx (protected, role ADMIN)
[ ] Liste réclamations avec filtres
[ ] Boutons actions : Approve, Reject
[ ] Page détail réclamation
```

**Jour 6 : Emails de notification**
```typescript
[ ] Créer EmailService complet
[ ] Templates HTML simples (Handlebars ou React Email)

Templates Phase 1 :
[ ] welcome.hbs - Email de bienvenue après register
[ ] verify-email.hbs - Lien de vérification
[ ] claim-created.hbs - Confirmation réclamation créée
[ ] claim-status-changed.hbs - Changement de statut
[ ] forgot-password.hbs - Reset MDP

[ ] Tester l'envoi de chaque email
[ ] Design simple mais propre (pas de HTML complexe)
```

**Jour 7 : Tests End-to-End**
```typescript
[ ] Installer Playwright ou Cypress
[ ] Créer tests E2E :
    - Register → Login → Create Claim → View Dashboard
    - Login → Forgot Password → Reset
    - Protected route redirection

[ ] Tester sur :
    - Chrome
    - Firefox
    - Safari (si possible)
    - Mobile viewport

[ ] Corriger bugs trouvés
```

**Jour 8 : Documentation et préparation beta**
```markdown
[ ] Créer README.md complet :
    - Description projet
    - Prérequis
    - Installation
    - Configuration (.env)
    - Lancement dev
    - Tests
    - Déploiement

[ ] Créer CONTRIBUTING.md (si projet open source)

[ ] Créer docs/DEPLOYMENT.md :
    - Instructions VPS Hetzner
    - Configuration Nginx
    - SSL Let's Encrypt
    - PM2

[ ] Créer docs/USER_GUIDE.md :
    - Comment créer une réclamation
    - Statuts et leur signification
    - FAQ

[ ] Préparer liste beta testeurs (5-10 personnes)
[ ] Créer formulaire feedback beta
```

**Livrables Semaine 7-8** :
- ✅ Dashboard utilisateur fonctionnel
- ✅ Landing page professionnelle
- ✅ Panel admin basique
- ✅ Emails de notification
- ✅ Tests E2E passants
- ✅ Documentation complète
- ✅ **MVP COMPLET ET PRÊT POUR BETA**

---

### 🎯 Critères de succès Phase 1

```yaml
Technique:
  ✅ Authentification fonctionne sans bug
  ✅ Formulaire de réclamation fluide et validé
  ✅ Calculs de compensation corrects (tests unitaires)
  ✅ Dashboard affiche bien les réclamations
  ✅ Emails envoyés correctement
  ✅ Aucun bug critique
  ✅ Temps de chargement < 3s

Business:
  ✅ 5-10 beta testeurs inscrits
  ✅ 5-15 réclamations créées
  ✅ Feedback positif sur UX
  ✅ Aucune erreur bloquante signalée

Prêt pour:
  ✅ Déploiement sur VPS Hetzner
  ✅ Ouverture beta publique (Phase 2)
  ✅ Ajout de fonctionnalités avancées
```

---

## PHASE 2 : AMÉLIORATION (Semaines 9-16)

### 🎯 Objectif Phase 2
Professionnaliser la plateforme avec :
- Support multilingue complet (FR, HE, EN)
- Upload et gestion de documents
- API de données de vol réelles
- Dashboard admin visuel complet

### 📦 Livrables Phase 2

#### **SEMAINE 9-10 : Multilingue complet**

**Objectif** : Support complet de 3 langues avec RTL pour l'hébreu.

```typescript
Tâches:
[ ] Configuration next-intl complète
[ ] Créer messages/ pour chaque locale (fr, he, en)
[ ] Traduire tous les textes :
    - Navigation
    - Formulaires (labels, placeholders, erreurs)
    - Dashboard
    - Emails
    - Landing page

[ ] Implémenter RTL pour hébreu :
    - tailwindcss-rtl plugin
    - Layout direction dynamique
    - Tester tous les composants en RTL

[ ] Créer LanguageSelector composant
[ ] Middleware de détection langue (browser)
[ ] Tester exhaustivement chaque langue

Budget traduction:
  - Gratuit : Vous + Google Translate + relecture
  - OU 300-500€ : Traducteurs natifs (recommandé)
```

#### **SEMAINE 11-12 : Upload et gestion documents**

**Objectif** : Permettre l'upload de documents (carte d'embarquement, etc.).

```typescript
Backend:
[ ] Créer DocumentsModule
[ ] Choisir storage :
    Option A: Local filesystem (/uploads) - Gratuit
    Option B: Cloudflare R2 - ~1€/mois

[ ] DocumentsService :
    - upload(file, claimId, type)
    - download(docId)
    - delete(docId)
    - validate(docId, status) // admin

[ ] API endpoints :
    - POST /claims/:id/documents (upload)
    - GET /claims/:id/documents (list)
    - GET /documents/:id (download)
    - DELETE /documents/:id
    - PATCH /documents/:id/validate (admin)

[ ] Validation :
    - Types MIME : PDF, JPG, PNG
    - Taille max : 5MB
    - Antivirus scan (optionnel Phase 3)

Frontend:
[ ] Composant DocumentUploader :
    - Drag & drop zone
    - Preview des fichiers
    - Progress bar
    - Liste des documents uploadés

[ ] Intégrer dans formulaire réclamation (étape 4 optionnelle)
[ ] Page documents dans dashboard
[ ] Admin : valider/rejeter documents
```

#### **SEMAINE 13-14 : API de données de vol**

**Objectif** : Vérifier automatiquement les vols avec une API réelle.

```typescript
Setup:
[ ] Créer compte AviationStack (ou FlightAware)
[ ] Plan Basic : 50-120€/mois

Backend:
[ ] Créer FlightDataModule
[ ] AviationStackAdapter :
    - searchFlight(flightNumber, date)
    - getFlightStatus(flightNumber, date)
    - Normaliser les données

[ ] Implémenter cache :
    Option A: node-cache (en mémoire) - Gratuit
    Option B: Redis - 40€/mois mais meilleur

[ ] Cache strategy :
    - TTL 24h pour données historiques
    - TTL 5min pour vols du jour

[ ] API endpoints :
    - GET /flight-data/search?q=AF1234&date=2025-01-01
    - GET /flight-data/validate?flight=AF1234&date=...

Frontend:
[ ] Autocomplete numéro de vol (debounced)
[ ] Affichage infos vol après sélection :
    - Compagnie
    - Route
    - Horaires prévus
    - Horaires réels (si disponible)
    - Statut

[ ] Pré-remplir departureAirport et arrivalAirport
[ ] Calculer automatiquement le retard
```

#### **SEMAINE 15-16 : Dashboard admin visuel**

**Objectif** : Interface d'administration complète et professionnelle.

```typescript
Frontend Admin:
[ ] Créer app/[locale]/admin/layout.tsx
[ ] Créer app/[locale]/admin/dashboard/page.tsx

Sections:
[ ] Overview (page d'accueil admin) :
    - Statistiques : Total claims, Pending, Approved, Rejected
    - Graphique : Claims par jour/semaine
    - Dernières réclamations
    - Alerts (documents à valider, etc.)

[ ] Claims Management :
    - Liste paginée avec filtres :
      * Status
      * Date range
      * Montant
      * Compagnie
      * Recherche (claim number, email)
    - Actions en masse :
      * Changer statut
      * Assigner agent (Phase 3)
      * Exporter CSV
    - Détail réclamation :
      * Toutes les infos
      * Timeline
      * Documents
      * Actions (Approve, Reject, Request docs)
      * Notes internes

[ ] Users Management (basique) :
    - Liste utilisateurs
    - Recherche
    - Voir réclamations d'un user
    - Suspendre compte (si nécessaire)

[ ] Documents :
    - Liste documents à valider
    - Preview dans modal
    - Valider/Rejeter
    - Demander document manquant

[ ] Settings :
    - Configuration email templates
    - Gestion des admins
    - Logs système

Design:
[ ] Utiliser Shadcn/ui (Sidebar, DataTable, Charts)
[ ] Responsive
[ ] Dark mode (optionnel mais cool)
```

**Livrables Phase 2** :
- ✅ Support multilingue FR, HE, EN avec RTL
- ✅ Upload et gestion documents
- ✅ API de vol réelle intégrée avec cache
- ✅ Dashboard admin professionnel
- ✅ Amélioration UX générale
- ✅ Tests complets

### 🎯 Critères de succès Phase 2

```yaml
Technique:
  ✅ 3 langues complètes et testées
  ✅ RTL hébreu parfait
  ✅ Documents uploadés et téléchargeables
  ✅ API de vol fonctionne avec cache
  ✅ Admin peut gérer toutes les réclamations efficacement

Business:
  ✅ 50-100 réclamations/mois
  ✅ Feedback positif sur multilingue
  ✅ Processus de validation documents fluide
  ✅ Taux de complétion formulaire > 80%
```

---

## PHASE 3 : AUTOMATISATION (Semaines 17-24)

### 🎯 Objectif Phase 3
Automatiser le maximum de tâches pour scaler efficacement.

### 📦 Livrables Phase 3

#### **SEMAINE 17-18 : Génération automatique de courriers**

```typescript
Backend:
[ ] Créer PdfGeneratorService
[ ] Utiliser PDFKit ou Puppeteer
[ ] Templates de courrier par compagnie :
    - Air France
    - Ryanair
    - EasyJet
    - Lufthansa
    - El Al
    - etc.

[ ] Merge des données :
    - Infos passager
    - Infos vol
    - Montant réclamé
    - Base légale (CE 261/2004 ou loi IL)
    - Références juridiques

[ ] Génération PDF/A pour archivage
[ ] Stockage dans documents de la claim

Frontend Admin:
[ ] Bouton "Générer courrier" dans détail claim
[ ] Preview PDF avant validation
[ ] Download PDF
[ ] Envoi automatique par email (optionnel)
```

#### **SEMAINE 19-20 : Amélioration dashboard admin**

```typescript
[ ] Implémenter graphiques (Chart.js ou Recharts) :
    - Claims par statut (pie chart)
    - Claims par mois (line chart)
    - Taux de succès (gauge)
    - Top compagnies (bar chart)

[ ] Rapports exportables :
    - Export Excel (exceljs)
    - Export PDF
    - Filtres par date, statut, compagnie

[ ] Système de notes internes :
    - Ajouter note sur claim
    - Historique des notes
    - Mentions @admin

[ ] Assignation d'agents :
    - Créer table Agent ou rôle AGENT
    - Assigner claim à un agent
    - Dashboard agent personnalisé
    - Workload balancing
```

#### **SEMAINE 21-22 : Communication et messagerie**

```typescript
Backend:
[ ] Créer MessagesModule
[ ] Schema Prisma Message :
    - claimId, senderId, receiverId
    - content, attachments
    - isRead, readAt

[ ] API endpoints :
    - POST /claims/:id/messages
    - GET /claims/:id/messages
    - PATCH /messages/:id/read

[ ] WebSocket avec Socket.io (optionnel Phase 3) :
    - Notification temps réel nouveau message
    - Typing indicator

Frontend:
[ ] Composant MessagingCenter :
    - Liste conversations (claims avec messages)
    - Thread de messages
    - Composer message
    - Upload attachments

[ ] Intégrer dans dashboard user et admin
[ ] Notifications in-app (badge count)

SMS (optionnel):
[ ] Intégrer Twilio
[ ] SMS pour événements importants :
    - Claim approuvé
    - Paiement effectué
    - Document manquant
```

#### **SEMAINE 23-24 : Optimisations et performance**

```typescript
Cache Redis:
[ ] Installer Redis sur VPS ou local
[ ] Migration du cache vers Redis
[ ] Stratégies de cache :
    - User session
    - Flight data
    - Claims list
    - Statistics

[ ] Cache invalidation intelligente

Optimisation DB:
[ ] Analyse des requêtes lentes (EXPLAIN)
[ ] Ajout d'indexes supplémentaires
[ ] Pagination optimisée
[ ] Eager loading pour éviter N+1

Frontend:
[ ] Code splitting (automatique Next.js)
[ ] Image optimization (next/image)
[ ] Lazy loading composants lourds
[ ] Compression assets

Monitoring:
[ ] Setup Better Stack (gratuit)
[ ] Setup Sentry error tracking (gratuit tier)
[ ] Logs structurés (Winston)
[ ] Alertes :
    - Site down > 5min
    - Error rate > 1%
    - API latency > 500ms
```

**Livrables Phase 3** :
- ✅ Génération automatique de courriers PDF
- ✅ Dashboard admin avec graphiques et rapports
- ✅ Système de notes et assignation
- ✅ Messagerie intégrée
- ✅ Cache Redis
- ✅ Optimisations performance
- ✅ Monitoring complet

### 🎯 Critères de succès Phase 3

```yaml
Technique:
  ✅ Génération PDF fonctionne pour toutes les compagnies
  ✅ Messagerie temps réel
  ✅ Cache hit ratio > 80%
  ✅ Latence API < 200ms P95
  ✅ Monitoring actif avec alertes

Business:
  ✅ 150-300 réclamations/mois
  ✅ Temps de traitement moyen < 10 jours (interne)
  ✅ Taux d'automatisation > 60%
  ✅ Satisfaction admin sur outils
```

---

## PHASE 4 : SCALE (Semaines 25-52)

### 🎯 Objectif Phase 4
Scaler la plateforme et préparer croissance à long terme.

### 📦 Livrables Phase 4 (6 mois)

#### **MOIS 7-8 : Expansion géographique**

```typescript
[ ] Traduction espagnol complète
[ ] Support législation supplémentaire (optionnel) :
    - UK (CE 261 post-Brexit)
    - Brésil (ANAC)
    - Canada (CTA)

[ ] Localisation :
    - Formats de date par locale
    - Formats de téléphone
    - Devises (EUR, USD, ILS, GBP)
    - Fuseaux horaires

[ ] SEO international :
    - Sitemap multilingue
    - hreflang tags
    - Content localisé par pays
```

#### **MOIS 9-10 : API B2B et partenariats**

```typescript
[ ] Créer API publique :
    - Documentation Swagger
    - Rate limiting par API key
    - Webhooks pour événements
    - SDK JavaScript (optionnel)

[ ] Endpoints B2B :
    - POST /api/v1/claims (créer réclamation)
    - GET /api/v1/claims/:id (status)
    - GET /api/v1/claims/:id/documents
    - Webhooks : claim.created, claim.approved, claim.paid

[ ] Dashboard partenaires :
    - Statistiques usage API
    - Consommation
    - Facturation

[ ] Partenariats :
    - Comparateurs de vols (Skyscanner, etc.)
    - Cartes de crédit (protection voyage)
    - Agences de voyage
    - OTA (Booking, Expedia)
```

#### **MOIS 11-12 : Mobile et features avancées**

```typescript
Option A - PWA:
[ ] Optimiser PWA :
    - Service Worker
    - Offline support
    - Install prompt
    - Push notifications

Option B - React Native:
[ ] Créer app React Native
[ ] Réutiliser logique frontend (expo)
[ ] Publier sur App Store et Google Play

Features avancées:
[ ] ML prédiction taux de succès :
    - Entraîner modèle sur données historiques
    - Features : compagnie, route, type, montant
    - Afficher probabilité de succès

[ ] OCR extraction documents :
    - Google Vision API ou Tesseract
    - Extraire automatiquement :
      * Numéro de vol
      * Date
      * Nom passager
    - Pré-remplir formulaire

[ ] Chatbot IA support :
    - OpenAI GPT-4 ou Claude
    - Répondre aux questions basiques
    - Escalade vers humain si nécessaire
```

**Livrables Phase 4** :
- ✅ Support 4 langues (FR, HE, EN, ES)
- ✅ API B2B documentée et utilisable
- ✅ App mobile (PWA ou native)
- ✅ ML prédiction succès
- ✅ OCR extraction documents
- ✅ Chatbot IA (optionnel)

### 🎯 Critères de succès Phase 4

```yaml
Technique:
  ✅ API B2B stable et documentée
  ✅ Mobile app publiée (ou PWA performante)
  ✅ ML accuracy > 80%
  ✅ OCR accuracy > 90%
  ✅ Infrastructure scale automatiquement

Business:
  ✅ 500-1000 réclamations/mois
  ✅ 5-10 partenaires B2B actifs
  ✅ Expansion internationale lancée
  ✅ CA > 50k€/mois
```

---

## 🔧 OUTILS ET TECHNOLOGIES PAR PHASE

### Phase 1 (MVP)
```yaml
Gratuits:
  - Node.js, PostgreSQL, Next.js, NestJS
  - Git, GitHub
  - VS Code
  - Prisma Studio
  - Postman

Payants:
  - VPS Hetzner: 8€/mois
  - Domaine: 1€/mois
  - Email Brevo: Gratuit (300 emails/jour)

Total: ~10€/mois
```

### Phase 2 (Amélioration)
```yaml
Ajouts:
  - API AviationStack: 50€/mois
  - Cloudflare R2: 1€/mois
  - Email Brevo Pro: 15€/mois (si volume)
  - Traduction: 300-500€ (one-time)

Total: ~80€/mois + 500€ one-time
```

### Phase 3 (Automatisation)
```yaml
Ajouts:
  - Redis (sur VPS): Gratuit
  - Better Stack: Gratuit
  - Sentry: Gratuit tier
  - Twilio (SMS): 20-50€/mois

Total: ~100€/mois
```

### Phase 4 (Scale)
```yaml
Ajouts:
  - VPS plus puissant: 50€/mois
  - Google Vision API: 30€/mois
  - OpenAI API: 50€/mois
  - Backups offsite: 10€/mois

Total: ~220€/mois
```

---

## 📊 TIMELINE VISUEL

```
Mois 1-2 (MVP)
═══════════════════════════════════════════
│ S1-2 │ S3-4  │ S5-6  │ S7-8  │
│ Setup│ Auth  │ Form  │ Dash  │
│      │       │ Calc  │ Beta  │
═══════════════════════════════════════════
Livrable: MVP fonctionnel, 10 beta users

Mois 3-4 (Amélioration)
═══════════════════════════════════════════
│ S9-10    │ S11-12  │ S13-14  │ S15-16  │
│ i18n+RTL │ Docs    │ API vol │ Admin++ │
═══════════════════════════════════════════
Livrable: Plateforme professionnelle, 50-100 claims/mois

Mois 5-6 (Automatisation)
═══════════════════════════════════════════
│ S17-18  │ S19-20   │ S21-22  │ S23-24  │
│ PDF Gen │ Admin++  │ Msg     │ Perf    │
═══════════════════════════════════════════
Livrable: Automatisation avancée, 150-300 claims/mois

Mois 7-12 (Scale)
═══════════════════════════════════════════════════════
│ M7-8    │ M9-10    │ M11-12                           │
│ Expand  │ B2B API  │ Mobile + ML/AI                   │
═══════════════════════════════════════════════════════
Livrable: Plateforme mature, 500-1000 claims/mois
```

---

## 🎯 INDICATEURS DE PERFORMANCE (KPIs)

### KPIs Techniques

| Métrique | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|----------|---------|---------|---------|---------|
| Uptime | 99% | 99.5% | 99.9% | 99.9% |
| Latence API (P95) | < 500ms | < 300ms | < 200ms | < 150ms |
| Temps chargement page | < 3s | < 2s | < 1.5s | < 1s |
| Error rate | < 2% | < 1% | < 0.5% | < 0.1% |
| Test coverage | 50% | 70% | 80% | 85% |

### KPIs Business

| Métrique | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|----------|---------|---------|---------|---------|
| Réclamations/mois | 10 | 50-100 | 150-300 | 500-1000 |
| Taux de conversion | 5% | 10% | 15% | 20% |
| Taux de succès | 60% | 70% | 75% | 80% |
| Panier moyen | 350€ | 400€ | 450€ | 500€ |
| CA mensuel | 600€ | 3-10k€ | 15-30k€ | 50-100k€ |
| NPS | 40 | 50 | 60 | 70 |

---

## ✅ CHECKLIST DE LANCEMENT PAR PHASE

### Phase 1 - Beta Privée

```markdown
Technique:
- [ ] Tous les tests passent (unitaires, E2E)
- [ ] Aucun bug critique
- [ ] Documentation README complète
- [ ] Variables d'environnement documentées
- [ ] Backups DB configurés

Légal:
- [ ] CGU version draft (template)
- [ ] Privacy Policy version draft
- [ ] Mentions légales
- [ ] Consentement RGPD

Business:
- [ ] Liste 5-10 beta testeurs
- [ ] Formulaire feedback créé
- [ ] Email d'invitation rédigé

GO/NO-GO Beta: Basé sur cette checklist
```

### Phase 2 - Beta Publique

```markdown
Technique:
- [ ] 3 langues complètes
- [ ] RTL testé exhaustivement
- [ ] API de vol fonctionne
- [ ] Documents uploadables
- [ ] Admin dashboard fonctionnel

Légal:
- [ ] CGU validées par avocat (recommandé)
- [ ] Privacy Policy validée
- [ ] Mandat de représentation prêt
- [ ] Assurance RC Pro souscrite (optionnel Phase 2)

Marketing:
- [ ] Landing page optimisée SEO
- [ ] Google Analytics configuré
- [ ] Premières pages contenu (blog)
- [ ] Comptes sociaux créés

GO/NO-GO Public: Basé sur feedback beta + checklist
```

### Phase 3 - Lancement Commercial

```markdown
Technique:
- [ ] Automatisation fonctionnelle
- [ ] Monitoring complet
- [ ] Alertes configurées
- [ ] Processus backup testé

Légal:
- [ ] Tous documents légaux validés
- [ ] Assurances souscrites
- [ ] Conformité RGPD vérifiée
- [ ] DPO nommé (si nécessaire)

Business:
- [ ] Équipe support formée
- [ ] Processus de gestion claims documenté
- [ ] Budget marketing alloué
- [ ] Campagnes ads prêtes

GO/NO-GO Commercial: Validation complète
```

---

## 📚 RESSOURCES ET LIENS UTILES

### Documentation technique
- Next.js: https://nextjs.org/docs
- NestJS: https://docs.nestjs.com
- Prisma: https://www.prisma.io/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Shadcn/ui: https://ui.shadcn.com
- next-intl: https://next-intl-docs.vercel.app

### Services
- Hetzner: https://www.hetzner.com
- Brevo: https://www.brevo.com
- AviationStack: https://aviationstack.com
- Cloudflare R2: https://developers.cloudflare.com/r2
- Better Stack: https://betterstack.com
- Sentry: https://sentry.io

### Réglementations
- CE 261/2004: https://europa.eu/youreurope/citizens/travel/passenger-rights/air/index_en.htm
- Loi israélienne: https://www.gov.il/en/departments/civil_aviation_authority

### Templates légaux
- CGU: https://www.legalstart.fr
- Privacy Policy: https://www.iubenda.com

---

## 🤝 SUPPORT ET CONTACT

Pour toute question sur ce plan de développement :
- Email: [votre-email]
- GitHub Issues: [votre-repo]/issues
- Discord/Slack: [votre-channel] (si applicable)

---

**Document créé le** : 26 Octobre 2025
**Version** : 1.0
**Auteur** : [Votre nom]
**Dernière mise à jour** : 26 Octobre 2025

**Ce plan de développement est un guide. Il peut et doit être adapté selon les retours terrain et les priorités qui émergent en cours de route.**

**Principe clé : Livrer rapidement, obtenir du feedback, itérer. 🚀**
