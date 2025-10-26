# SESSION 5 - PLAN DE TRAVAIL
## Phase 2 : Internationalisation (i18n) - Partie 1/2

**Date** : 26 Octobre 2025
**Objectif** : Setup next-intl et configuration de base multilingue
**Durée estimée** : 2-3 heures
**Statut** : 🚀 EN COURS

---

## 🎯 OBJECTIF DE LA SESSION

Mettre en place l'infrastructure d'internationalisation pour supporter 3 langues (FR, HE, EN) avec direction RTL pour l'hébreu.

---

## 📋 TÂCHES DE LA SESSION

### ✅ Tâche 1 : Installation et Configuration (30 min)

**1.1 Installer next-intl**
```bash
✅ cd apps/web && npm install next-intl
```

**1.2 Créer fichier de configuration i18n**
```typescript
[ ] Créer apps/web/i18n.config.ts :
    export const locales = ['fr', 'he', 'en'] as const;
    export const defaultLocale = 'fr' as const;
    export type Locale = (typeof locales)[number];

    export function getDirection(locale: Locale): 'ltr' | 'rtl' {
      return locale === 'he' ? 'rtl' : 'ltr';
    }
```

**1.3 Créer fonction getMessages**
```typescript
[ ] Créer apps/web/lib/i18n.ts :
    import { notFound } from 'next/navigation';
    import { getRequestConfig } from 'next-intl/server';
    import { locales } from '@/i18n.config';

    export default getRequestConfig(async ({ locale }) => {
      if (!locales.includes(locale as any)) notFound();
      return {
        messages: (await import(`../messages/${locale}.json`)).default
      };
    });
```

**1.4 Configurer next.config.js**
```javascript
[ ] Modifier apps/web/next.config.js :
    const withNextIntl = require('next-intl/plugin')('./lib/i18n.ts');

    module.exports = withNextIntl({
      // ... config existante
    });
```

---

### ✅ Tâche 2 : Structure des Messages (45 min)

**2.1 Créer structure de dossiers**
```bash
[ ] mkdir -p apps/web/messages
[ ] Créer structure :
    messages/
    ├── fr.json    # Français (baseline)
    ├── he.json    # Hébreu
    └── en.json    # Anglais
```

**2.2 Créer messages français (baseline)**
```json
[ ] Créer apps/web/messages/fr.json avec sections :
    {
      "nav": {
        "home": "Accueil",
        "dashboard": "Tableau de bord",
        "newClaim": "Nouvelle réclamation",
        "login": "Connexion",
        "register": "S'inscrire",
        "logout": "Se déconnecter"
      },
      "common": {
        "submit": "Soumettre",
        "cancel": "Annuler",
        "next": "Suivant",
        "previous": "Précédent",
        "save": "Enregistrer",
        "delete": "Supprimer",
        "edit": "Modifier",
        "close": "Fermer",
        "loading": "Chargement...",
        "error": "Une erreur est survenue"
      },
      "auth": {
        "loginTitle": "Connexion à votre compte",
        "registerTitle": "Créer un compte",
        "email": "Email",
        "password": "Mot de passe",
        "firstName": "Prénom",
        "lastName": "Nom",
        "phone": "Téléphone",
        "loginButton": "Se connecter",
        "registerButton": "Créer mon compte",
        "forgotPassword": "Mot de passe oublié ?",
        "noAccount": "Pas de compte ?",
        "hasAccount": "Déjà un compte ?",
        "loginLink": "Se connecter",
        "registerLink": "S'inscrire"
      },
      "claim": {
        "title": "Nouvelle réclamation",
        "step1Title": "Informations du vol",
        "step2Title": "Type de perturbation",
        "step3Title": "Vos informations",
        "step4Title": "Résultat",
        "flightNumber": "Numéro de vol",
        "flightDate": "Date du vol",
        "departureAirport": "Aéroport de départ",
        "arrivalAirport": "Aéroport d'arrivée",
        "airline": "Compagnie aérienne (optionnel)",
        "disruptionType": "Type de perturbation",
        "delay": "Retard",
        "cancellation": "Annulation",
        "deniedBoarding": "Refus d'embarquement",
        "delayMinutes": "Durée du retard (minutes)",
        "bookingReference": "Référence de réservation",
        "submit": "Calculer mon indemnisation",
        "calculating": "Calcul en cours..."
      },
      "dashboard": {
        "title": "Mes réclamations",
        "welcome": "Bienvenue",
        "totalClaims": "Réclamations totales",
        "inProgress": "En cours",
        "approved": "Approuvées",
        "newClaim": "Créer une réclamation",
        "noClaims": "Aucune réclamation pour le moment",
        "createFirst": "Créez votre première réclamation",
        "claimNumber": "N°",
        "flight": "Vol",
        "status": "Statut",
        "amount": "Montant",
        "date": "Date",
        "viewDetails": "Voir les détails"
      },
      "status": {
        "DRAFT": "Brouillon",
        "SUBMITTED": "Soumise",
        "IN_REVIEW": "En cours d'examen",
        "APPROVED": "Approuvée",
        "REJECTED": "Rejetée",
        "PAID": "Payée",
        "CANCELLED": "Annulée"
      }
    }
```

**2.3 Créer messages hébreux**
```json
[ ] Créer apps/web/messages/he.json avec traductions hébraïques
    Note : Utiliser traducteur professionnel ou service de traduction
    Pour cette session, on peut utiliser une traduction basique via Google Translate
    et prévoir d'affiner avec un natif plus tard
```

**2.4 Créer messages anglais**
```json
[ ] Créer apps/web/messages/en.json avec traductions anglaises
```

---

### ✅ Tâche 3 : Restructurer Routes avec [locale] (1 heure)

**3.1 Créer nouvelle structure app avec [locale]**
```bash
[ ] Créer apps/web/app/[locale]/ directory
[ ] Déplacer tous les fichiers actuels dans [locale]/ :
    app/
    ├── [locale]/
    │   ├── page.tsx           # Landing page
    │   ├── layout.tsx         # Layout avec dir RTL
    │   ├── login/
    │   │   └── page.tsx
    │   ├── register/
    │   │   └── page.tsx
    │   ├── dashboard/
    │   │   └── page.tsx
    │   └── claims/
    │       ├── new/
    │       │   └── page.tsx
    │       └── [id]/
    │           └── page.tsx
    └── globals.css            # Reste à la racine
```

**3.2 Adapter Root Layout**
```typescript
[ ] Modifier apps/web/app/[locale]/layout.tsx :
    import { NextIntlClientProvider } from 'next-intl';
    import { getMessages } from 'next-intl/server';
    import { getDirection } from '@/i18n.config';

    export default async function LocaleLayout({
      children,
      params: { locale }
    }: {
      children: React.ReactNode;
      params: { locale: string };
    }) {
      const messages = await getMessages();
      const direction = getDirection(locale as Locale);

      return (
        <html lang={locale} dir={direction}>
          <body>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </body>
        </html>
      );
    }
```

**3.3 Créer middleware pour locale**
```typescript
[ ] Créer apps/web/middleware.ts :
    import createMiddleware from 'next-intl/middleware';
    import { locales, defaultLocale } from './i18n.config';

    export default createMiddleware({
      locales,
      defaultLocale,
      localePrefix: 'always' // URLs: /fr/..., /he/..., /en/...
    });

    export const config = {
      matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
    };
```

---

### ✅ Tâche 4 : Adapter Composants Existants (45 min)

**4.1 Adapter Landing Page**
```typescript
[ ] Modifier apps/web/app/[locale]/page.tsx :
    import { useTranslations } from 'next-intl';

    export default function Home() {
      const t = useTranslations('home');

      return (
        <div>
          <h1>{t('title')}</h1>
          <p>{t('subtitle')}</p>
          {/* ... */}
        </div>
      );
    }
```

**4.2 Adapter Login Page**
```typescript
[ ] Modifier apps/web/app/[locale]/login/page.tsx :
    import { useTranslations } from 'next-intl';

    export default function LoginPage() {
      const t = useTranslations('auth');

      return (
        <div>
          <h1>{t('loginTitle')}</h1>
          <input placeholder={t('email')} />
          {/* ... */}
        </div>
      );
    }
```

**4.3 Adapter Register Page**
```typescript
[ ] Similaire à Login
```

**4.4 Adapter Dashboard**
```typescript
[ ] Modifier dashboard pour utiliser useTranslations('dashboard')
```

---

### ✅ Tâche 5 : Tests Basiques (30 min)

**5.1 Tester navigation entre langues**
```bash
[ ] Démarrer serveur dev : npm run dev
[ ] Tester URLs :
    - http://localhost:3000/fr
    - http://localhost:3000/he
    - http://localhost:3000/en

[ ] Vérifier redirection automatique /fr si pas de locale
```

**5.2 Vérifier direction RTL pour hébreu**
```bash
[ ] Ouvrir http://localhost:3000/he
[ ] Vérifier que direction est RTL (attribut dir="rtl" sur <html>)
[ ] Vérifier alignement texte
```

**5.3 Vérifier traductions chargées**
```bash
[ ] Ouvrir DevTools Console
[ ] Vérifier aucune erreur i18n
[ ] Vérifier textes affichés correspondent à la langue
```

---

## 🎯 RÉSULTAT ATTENDU DE LA SESSION

À la fin de cette session, nous aurons :
- ✅ next-intl installé et configuré
- ✅ Structure messages/ avec FR/HE/EN (basique)
- ✅ Routes restructurées avec [locale]
- ✅ Direction RTL fonctionnelle pour hébreu
- ✅ Landing page, login, register adaptés à i18n
- ✅ Navigation entre langues fonctionnelle

**Ce qui reste pour Session 6** :
- Créer composant LanguageSelector
- Adapter dashboard et claim form à i18n
- Affiner traductions hébraïques avec natif
- Adapter tous les messages d'erreur
- Support RTL pour tous les composants complexes
- Tests exhaustifs des 3 langues

---

## 📝 NOTES IMPORTANTES

### URLs avec locale
```
Avant : /dashboard
Après : /fr/dashboard, /he/dashboard, /en/dashboard
```

### Utilisation dans composants
```typescript
// Server Component
import { useTranslations } from 'next-intl';
const t = useTranslations('namespace');

// Client Component
'use client';
import { useTranslations } from 'next-intl';
const t = useTranslations('namespace');
```

### Direction RTL
```typescript
// Layout automatique avec dir="rtl"
// Utiliser classes Tailwind RTL :
className="ltr:text-left rtl:text-right"
className="ltr:ml-4 rtl:mr-4"
```

---

## 🔍 CHECKLIST DE FIN DE SESSION

- [ ] next-intl installé
- [ ] i18n.config.ts créé
- [ ] lib/i18n.ts créé
- [ ] next.config.js configuré
- [ ] messages/fr.json créé avec toutes les clés
- [ ] messages/he.json créé (traduction basique)
- [ ] messages/en.json créé
- [ ] Structure app/[locale]/ créée
- [ ] middleware.ts créé
- [ ] Layout adapté avec dir RTL
- [ ] Landing page i18n
- [ ] Login page i18n
- [ ] Register page i18n
- [ ] Tests basiques passent (FR/HE/EN accessibles)
- [ ] Direction RTL fonctionne pour hébreu
- [ ] Commit : "feat(web): setup next-intl with FR/HE/EN support and RTL"

---

**Document créé le** : 26 Octobre 2025
**Session** : 5 (Phase 2, Partie 1)
**Temps estimé** : 2-3 heures
**Prérequis** : Phase 1 complétée ✅

**Let's go ! 🚀**
