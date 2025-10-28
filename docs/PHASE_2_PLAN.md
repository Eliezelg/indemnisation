# PLAN DÉTAILLÉ PHASE 2 - AMÉLIORATION
## Plateforme d'Indemnisation Vols Perturbés

**Durée** : 8 semaines (Mois 3-4)
**Objectif** : Professionnaliser la plateforme MVP
**Budget** : ~80€/mois
**Prérequis** : Phase 1 MVP complétée ✅

---

## 🎯 OBJECTIF PHASE 2

Transformer le MVP en une plateforme professionnelle multi-utilisateur avec :
1. Support multilingue complet (FR, HE, EN) avec RTL
2. Upload et gestion de documents
3. Intégration API de données de vol réelles
4. Dashboard admin visuel complet
5. Amélioration générale de l'UX

---

## 📦 LIVRABLES PHASE 2

Au terme des 8 semaines :
- ✅ Support complet 3 langues (français, hébreu, anglais)
- ✅ Interface RTL parfaite pour l'hébreu
- ✅ Upload de documents (carte d'embarquement, etc.)
- ✅ Validation admin des documents
- ✅ API de vol réelle intégrée (AviationStack)
- ✅ Autocomplete numéros de vol
- ✅ Dashboard admin professionnel
- ✅ Statistiques et graphiques
- ✅ Gestion avancée des réclamations

---

## 📅 PLANNING DÉTAILLÉ PHASE 2

### ✅ SEMAINE 9-10 : Internationalisation (i18n) Complète - COMPLÉTÉ

#### Objectif ✅ ATTEINT
Support multilingue FR/HE/EN avec direction RTL pour l'hébreu.

#### Tâches Backend

**Jour 1-2 : Emails multilingues**
```typescript
[ ] Créer EmailTemplatesService
[ ] Templates par langue :
    - welcome.{fr,he,en}.hbs
    - claim-created.{fr,he,en}.hbs
    - claim-status.{fr,he,en}.hbs
    - verify-email.{fr,he,en}.hbs

[ ] Logique de sélection template selon locale user
[ ] Tester envoi emails dans les 3 langues
```

#### Tâches Frontend

**Jour 3-4 : Configuration next-intl**
```typescript
[✅] Installer next-intl :
    npm install next-intl

[✅] Créer structure messages/ :
    messages/
    ├── fr.json (unified structure)
    ├── he.json (unified structure)
    └── en.json (unified structure)

[✅] Configurer i18n.config.ts :
    export const locales = ['fr', 'he', 'en'] as const;
    export const defaultLocale = 'fr' as const;

[✅] Créer middleware.ts pour détection langue
[✅] Restructurer routes : app/[locale]/...
```

**Jour 5 : Traductions françaises**
```json
[✅] Traduire tous les textes en français (baseline)
[✅] common.json : navigation, boutons, labels
[✅] auth.json : pages login, register, forgot-password
[✅] claim.json : formulaire 3 étapes, labels, erreurs
[✅] dashboard.json : titres, statuts, actions
```

**Jour 6 : Traductions hébraïques**
```json
[✅] Traduire tous les textes en hébreu
[✅] Vérifier termes légaux corrects
[✅] Adapter formulations culturellement
[✅] Traduction professionnelle réalisée
```

**Jour 7 : Traductions anglaises**
```json
[✅] Traduire tous les textes en anglais
[✅] Vérifier termes juridiques (UK English)
[✅] Relecture native speaker
```

**Jour 8-9 : Support RTL**
```typescript
[✅] Configuration RTL dans i18n :
    Support RTL via next-intl et Tailwind CSS

[✅] Adapter layout.tsx :
    <html lang={locale} dir={direction}>

[✅] Refactorer composants avec classes RTL :
    - Direction automatique basée sur locale
    - Support complet hébreu RTL
    - Navigation et layout adaptés

[✅] Tester exhaustivement tous les composants en RTL
```

**Jour 10 : Language Selector**
```typescript
[✅] Créer composant LanguageSelector :
    - Dropdown avec drapeaux
    - FR 🇫🇷 | HE 🇮🇱 | EN 🇬🇧
    - Navigation entre locales
    - Persistence via URL routing

[✅] Intégrer dans navbar
[✅] Intégrer dans footer
[✅] Tests de changement de langue
```

**Tests et Validation Semaine 9-10** :
- [✅] Toutes les pages traduites dans 3 langues
- [✅] RTL parfait pour hébreu (support complet)
- [✅] Sélecteur de langue fonctionnel
- [ ] Emails envoyés dans la bonne langue (à faire en Semaine 11-12)
- [✅] Navigation fluide entre langues

---

### ✅ SEMAINE 11-12 : Upload et Gestion de Documents - COMPLÉTÉ

#### Objectif ✅ ATTEINT
Permettre l'upload de documents (carte d'embarquement, justificatifs) avec validation admin.

#### Tâches Backend

**Jour 1-2 : Storage et Upload**
```typescript
[ ] Décision de storage :
    Option A : Local filesystem (/uploads) - Gratuit
    Option B : Cloudflare R2 - ~1€/mois (recommandé)

[ ] Si Cloudflare R2 :
    - Créer compte Cloudflare
    - Créer bucket R2
    - Installer @aws-sdk/client-s3
    - Configurer credentials

[ ] Créer DocumentsModule
[ ] Créer Document model Prisma :
    model Document {
      id          String   @id @default(cuid())
      claimId     String
      type        String   // BOARDING_PASS, ID, RECEIPT
      filename    String
      originalName String
      mimeType    String
      size        Int
      path        String   // ou R2 key
      status      String   @default("PENDING") // PENDING, VALIDATED, REJECTED
      uploadedAt  DateTime @default(now())
      validatedAt DateTime?
      claim       Claim    @relation(fields: [claimId], references: [id])
    }

[ ] Créer migration : npx prisma migrate dev --name add_documents
```

**Jour 3 : DocumentsService**
```typescript
[ ] Implémenter DocumentsService :
    - upload(file, claimId, type, userId)
      * Vérifier taille (max 5MB)
      * Vérifier MIME type (PDF, JPG, PNG)
      * Upload vers R2 ou filesystem
      * Créer entrée DB
      * Retourner document info

    - download(docId, userId)
      * Vérifier ownership
      * Générer signed URL (R2) ou stream file
      * Retourner file

    - delete(docId, userId)
      * Vérifier ownership
      * Supprimer de R2/filesystem
      * Supprimer de DB

    - validate(docId, status) // Admin only
      * Mettre à jour status (VALIDATED/REJECTED)
      * Envoyer email notification

[ ] Tests unitaires upload/download/delete
```

**Jour 4 : DocumentsController**
```typescript
[ ] Créer endpoints :
    - POST /claims/:id/documents
      * @UseInterceptors(FileInterceptor('file'))
      * Vérifier ownership claim
      * Appeler DocumentsService.upload()

    - GET /claims/:id/documents
      * Lister documents d'une claim
      * Vérifier ownership

    - GET /documents/:id
      * Download document
      * Vérifier ownership

    - DELETE /documents/:id
      * Supprimer document
      * Vérifier ownership

    - PATCH /documents/:id/validate (Admin)
      * Valider/rejeter document
      * body: { status: 'VALIDATED' | 'REJECTED', reason? }

[ ] Tests avec Postman (upload PDF, JPG, PNG)
```

#### Tâches Frontend

**Jour 5-6 : Composant DocumentUploader**
```typescript
[ ] Créer components/forms/DocumentUploader.tsx :
    - Drag & drop zone (react-dropzone)
    - Preview des fichiers uploadés
    - Progress bar pendant upload
    - Validation côté client :
      * Types acceptés : .pdf, .jpg, .jpeg, .png
      * Taille max : 5MB
    - Messages d'erreur clairs

[ ] Styling responsive
[ ] Tests upload divers fichiers
```

**Jour 7 : Intégration formulaire**
```typescript
[ ] Ajouter étape 4 optionnelle au formulaire claim :
    - "Documents justificatifs (optionnel)"
    - Upload carte d'embarquement
    - Upload autre document
    - Continuer sans document

[ ] Adapter ClaimForm pour gérer documents
[ ] Upload APRÈS création claim (claim.id disponible)
```

**Jour 8 : Page Documents dans Dashboard**
```typescript
[ ] Créer app/[locale]/dashboard/claims/[id]/documents/page.tsx
[ ] Afficher liste documents uploadés :
    - Nom fichier
    - Type
    - Taille
    - Statut (Pending, Validated, Rejected)
    - Actions : Download, Delete

[ ] Bouton "Ajouter un document"
[ ] Empty state si aucun document
```

**Jour 9-10 : Admin - Validation Documents**
```typescript
[ ] Créer app/[locale]/admin/documents/page.tsx
[ ] Liste documents à valider :
    - Filtrer par statut PENDING
    - Afficher claim associée
    - Preview dans modal (pour PDF/images)

[ ] Actions admin :
    - Valider (PATCH /documents/:id/validate)
    - Rejeter (avec raison)
    - Demander document manquant à user

[ ] Tests validation flow complet
```

**Tests et Validation Semaine 11-12** :
- [ ] Upload de PDF, JPG, PNG fonctionne
- [ ] Preview dans admin
- [ ] Validation/rejet fonctionne
- [ ] Email notification envoyé
- [ ] Download document fonctionne
- [ ] Suppression fonctionne

---

### SEMAINE 13-14 : API de Données de Vol

#### Objectif
Intégrer API AviationStack pour vérifier automatiquement les vols et pré-remplir le formulaire.

#### Tâches Backend

**Jour 1 : Setup AviationStack**
```bash
[ ] Créer compte AviationStack :
    https://aviationstack.com

[ ] Choisir plan :
    - Free : 100 req/mois (limité pour tester)
    - Basic : 10,000 req/mois, ~50€/mois

[ ] Obtenir API key
[ ] Ajouter dans .env :
    AVIATION_STACK_API_KEY=your_key_here
```

**Jour 2-3 : FlightDataModule**
```typescript
[ ] Créer FlightDataModule
[ ] Créer AviationStackAdapter :
    - searchFlights(query: string, date?: string)
      * Appelle GET /flights?search={query}&flight_date={date}
      * Parse réponse
      * Normalise données

    - getFlightStatus(flightNumber: string, date: string)
      * Appelle GET /flights?flight_iata={flightNumber}&flight_date={date}
      * Retourne status, delays, airports, etc.

[ ] Gérer erreurs API :
    - Rate limit exceeded
    - Invalid API key
    - Flight not found

[ ] Tests avec vrais numéros de vol
```

**Jour 4 : Cache Layer**
```typescript
[ ] Option A - node-cache (simple) :
    npm install node-cache
    const cache = new NodeCache({ stdTTL: 86400 }); // 24h

[ ] Option B - Redis (meilleur) :
    npm install @nestjs/cache-manager cache-manager
    npm install cache-manager-redis-store

[ ] Implémenter cache :
    - TTL 24h pour vols historiques
    - TTL 5min pour vols du jour
    - Cache key : `flight:${flightNumber}:${date}`

[ ] FlightDataService :
    - Wrapper qui check cache avant API call
    - Sauvegarde résultat dans cache
```

**Jour 5 : FlightDataController**
```typescript
[ ] Créer endpoints :
    - GET /flight-data/search?q={query}&date={YYYY-MM-DD}
      * Retourne liste vols correspondants
      * Pagination (10 résultats)

    - GET /flight-data/validate?flight={XX1234}&date={YYYY-MM-DD}
      * Vérifie qu'un vol existe
      * Retourne détails complets si trouvé
      * Cache la réponse

[ ] Protection rate limiting (10 req/min/user)
[ ] Tests avec Postman
```

#### Tâches Frontend

**Jour 6-7 : Autocomplete Numéro de Vol**
```typescript
[ ] Créer components/forms/FlightNumberInput.tsx :
    - Input avec autocomplete
    - Debounced search (500ms)
    - Appelle GET /flight-data/search
    - Affiche suggestions :
      * AF1234 - Paris CDG → Tel Aviv TLV
      * Horaires prévus
    - Sélection → pré-remplit departureAirport, arrivalAirport

[ ] Loading state pendant recherche
[ ] Gestion erreurs (aucun résultat, API down)
```

**Jour 8 : Intégration Formulaire**
```typescript
[ ] Remplacer input flightNumber simple par FlightNumberInput
[ ] Quand vol sélectionné :
    - Appeler GET /flight-data/validate avec date
    - Pré-remplir departure et arrival
    - Pré-remplir airline
    - Si delay info disponible, pré-remplir delayMinutes

[ ] Utilisateur peut modifier valeurs si besoin
[ ] Validation que vol existe (optionnel)
```

**Jour 9-10 : Affichage Infos Vol**
```typescript
[ ] Créer composant FlightInfoCard :
    - Affiche infos vol après autocomplete :
      * Compagnie + logo
      * Route complète
      * Horaires prévus
      * Horaires réels (si disponible)
      * Retard calculé automatiquement

[ ] Intégrer dans formulaire (entre étape 1 et 2)
[ ] Design responsive
[ ] Tests avec plusieurs vols
```

**Tests et Validation Semaine 13-14** :
- [ ] Autocomplete fonctionne (vols réels)
- [ ] Cache évite appels API répétés
- [ ] Pré-remplissage automatique fonctionne
- [ ] Calcul retard correct
- [ ] Utilisateur peut modifier si besoin
- [ ] Gestion erreurs API

---

### ✅ SEMAINE 15-16 : Dashboard Admin Professionnel - COMPLÉTÉ

#### Objectif ✅ ATTEINT
Créer un dashboard admin complet pour gérer efficacement toutes les réclamations.

#### Tâches Backend

**Jour 0 : User Roles & Authentication**
```typescript
[✅] Ajouter UserRole enum à Prisma :
    - enum UserRole { USER, ADMIN }
    - User.role field avec default USER

[✅] Mise à jour AuthService :
    - Include role dans JWT payload
    - Role-based authentication

[✅] Créer AdminGuard :
    - Vérifier role ADMIN
    - Protection endpoints admin

[✅] Migration database :
    - Ajouter colonne role
    - Set admin pour compte test (eliezelg@gmail.com)
```

**Jour 1 : API Stats**
```typescript
[✅] Créer StatsService :
    - getOverviewStats()
      * Total claims
      * Claims pending review
      * Claims approved this month
      * Average claim amount

    - getClaimsByMonth() - 6 derniers mois
    - getClaimsByStatus() - Distribution
    - getTopAirlines() - Top 5

[✅] Créer StatsController :
    - GET /admin/stats/overview
    - GET /admin/stats/claims-by-month
    - GET /admin/stats/claims-by-status
    - GET /admin/stats/top-airlines

[✅] Protection @UseGuards(JwtAuthGuard, AdminGuard)
```

**Jour 2 : API Admin Claims**
```typescript
[✅] Améliorer ClaimsController pour admin :
    - GET /admin/claims
      * Liste TOUTES les claims (tous users)
      * Pagination (page, limit)
      * Filtres (status)
      * Recherche (claim number, flight, email, name)
      * Includes user et flight info

    - PATCH /admin/claims/:id/status
      * Changer statut manuellement
      * body: { status }
      * Workflow validation

[ ] POST /admin/claims/:id/notes (Phase 3)
      * Ajouter note interne

[✅] Tests admin endpoints
```

#### Tâches Frontend Admin

**Jour 3-4 : Layout Admin**
```typescript
[✅] Créer app/[locale]/admin/layout.tsx :
    - Sidebar navigation :
      * Dashboard (overview)
      * Claims Management
      * Documents (placeholder)
      * Users (placeholder)
      * Settings (placeholder)
      * Reports (placeholder)
    - Responsive (drawer sur mobile)
    - Support i18n avec next-intl

[✅] AdminSidebar component avec icons (Lucide)
[✅] Protection route (placeholder pour auth check)
[✅] Tests navigation
[✅] Fix Next.js 15 async params
```

**Jour 5-6 : Overview Page**
```typescript
[✅] Créer app/[locale]/admin/page.tsx (dashboard)

[✅] Section Stats Cards :
    - Total Claims (all time)
    - Pending Review (count)
    - Approved This Month
    - Average Amount

[✅] Section Charts (Recharts) :
    - Line Chart : Claims par mois (6 derniers mois)
    - Pie Chart : Claims par statut
    - Bar Chart : Top 5 compagnies

[✅] Section Réclamations Récentes :
    - Table des récentes claims
    - Status badges
    - Liens vers détails

[✅] Loading states et error handling
[✅] Responsive design
```

**Jour 7-8 : Claims Management Page**
```typescript
[✅] Créer app/[locale]/admin/claims/page.tsx

[✅] Table complète :
    - Colonnes :
      * Claim Number
      * Client (name + email)
      * Flight
      * Disruption Type (badge)
      * Status (badge)
      * Amount
      * Date
      * Actions (View)

[✅] Filtres :
    - Status (dropdown all/draft/submitted/in_review/etc.)
    - Search (claim number, flight, client name, email)

[✅] Export CSV :
    - Export des claims filtrées
    - Toutes les colonnes

[✅] Pagination : 10 items/page
[✅] Status badges avec couleurs
```

**Jour 9 : Claim Detail Admin**
```typescript
[✅] Créer app/[locale]/admin/claims/[id]/page.tsx

[✅] Section Claim Info (read-only) :
    - Toutes les infos claim
    - Flight info avec icons
    - Passenger info
    - Compensation calculation

[✅] Section Quick Actions :
    - Change Status workflow :
      * DRAFT → Submit for Review
      * SUBMITTED → In Review
      * IN_REVIEW → Approve / Reject
      * APPROVED → Mark as Paid
    - Bouton "Change Status" avec confirmation

[✅] Section Documents :
    - Liste documents uploadés
    - Liens de téléchargement

[✅] Section History :
    - Created timestamp
    - Submitted timestamp (if applicable)

[ ] Section Notes Internes (Phase 3)
    - Add/view internal notes
```

**Jour 10 : Users Management**
```typescript
[✅] Créer app/[locale]/admin/users/page.tsx
[✅] Créer AdminUsersController backend
[✅] GET /admin/users - Liste tous les users
[✅] GET /admin/users/stats - Statistiques users
[✅] Liste users avec 5 cartes de stats
[✅] Table complète avec toutes les infos
[✅] Search par nom/email
[✅] Filtres par rôle (Client/Admin)
```

**Jour 11 : Statistics Page**
```typescript
[✅] Créer app/[locale]/admin/statistics/page.tsx
[✅] 4 cartes métriques avec tendances
[✅] Filtre plage temporelle (6/12/24 mois)
[✅] Area Chart - Tendance des claims
[✅] 2 Pie Charts - Statuts et types de perturbation
[✅] Area Chart - Montants mensuels
[✅] Bar Chart - Top 10 airlines
[✅] Table détaillée types de perturbation
```

**Jour 12 : Settings Page**
```typescript
[✅] Créer app/[locale]/admin/settings/page.tsx
[✅] Section Email Notifications (5 toggles)
[✅] Section System Configuration
[✅] Section Localization & Region
[✅] Section Compensation Limits
[✅] Section Database & Backup
[✅] Bouton Save Changes avec feedback
```

**Tests et Validation Semaine 15-16** :
- [✅] Dashboard overview affiche stats correctes
- [✅] Charts fonctionnent (responsive, Recharts)
- [✅] Claims management : filtres, recherche, pagination
- [✅] Change status fonctionne avec workflow
- [✅] Export CSV fonctionne
- [✅] Design professionnel avec Tailwind
- [✅] Support multilingue (admin namespace)
- [✅] Users management complet avec stats
- [✅] Statistics page avec charts avancés
- [✅] Settings page avec configuration complète
- [✅] Document download avec authentication
- [✅] Bouton déconnexion dans sidebar
- [✅] Affichage vrai nom utilisateur
- [ ] Email notification lors changement status (reporté Phase 3)
- [ ] Notes internes (reporté Phase 3)

---

## 📊 BILAN PHASE 2

### ✅ Résultats Obtenus (Semaine 9-10, 15-16 COMPLÉTÉES)

**Technique** :
- ✅ 3 langues complètes (FR, HE, EN) avec next-intl
- ✅ RTL parfait pour hébreu
- ✅ Upload documents fonctionnel (Fastify multipart)
- ✅ Validation documents par admin
- ⏳ API de vol intégrée (Semaine 13-14 - À FAIRE)
- ✅ Dashboard admin professionnel COMPLET
- ✅ 7 pages admin complètes:
  * Dashboard avec stats et charts
  * Claims Management avec filtres
  * Claim Detail avec actions
  * Users Management avec stats
  * Documents Validation
  * Statistics avancées
  * Settings complets

**Business** :
- 🎯 50-100 réclamations/mois
- 🎯 Taux de complétion formulaire > 80%
- 🎯 Temps de traitement admin < 5 jours
- 🎯 Satisfaction user sur multilingue

**Budget** :
```yaml
Infrastructure:
  - VPS Hetzner: 8-15€/mois
  - Cloudflare R2: 1€/mois
  - AviationStack: 50€/mois
  - Email Brevo: 15€/mois (si volume)

Total: ~75-80€/mois
```

---

## 🎯 CRITÈRES DE SUCCÈS PHASE 2

### Obligatoires
- [ ] 3 langues complètes et sans bug
- [ ] RTL hébreu parfait (aucun élément mal aligné)
- [ ] Upload documents fonctionne (PDF + images)
- [ ] Admin peut valider/rejeter documents
- [ ] API de vol fonctionne avec cache
- [ ] Dashboard admin utilisable efficacement

### Optionnels (Phase 3 si manque de temps)
- [ ] Email multilingue (peut rester FR Phase 2)
- [ ] Export CSV avancé
- [ ] Graphiques animés
- [ ] Dark mode admin

---

## 🚀 APRÈS PHASE 2 - PHASE 3

**Priorités Phase 3** :
1. Génération automatique de courriers PDF par compagnie
2. Amélioration dashboard admin (graphiques, rapports)
3. Système de notes et assignation d'agents
4. Messagerie intégrée (user ↔ admin)
5. Cache Redis pour performance
6. Monitoring et alertes

---

**Document créé le** : 26 Octobre 2025
**Version** : 1.0
**Durée Phase 2** : 8 semaines
**Objectif** : Plateforme professionnelle multi-langue

**Prêt à commencer Phase 2 ! 🚀**
