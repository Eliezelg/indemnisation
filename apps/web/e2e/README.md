# Tests E2E - Playwright

Tests end-to-end pour la plateforme d'indemnisation vols perturbés.

## 📁 Structure des Tests

```
e2e/
├── airport-autocomplete.spec.ts    # Tests autocomplete aéroports
├── flight-validation.spec.ts       # Tests validation numéro de vol
├── claim-creation.spec.ts          # Tests flow création réclamation
├── admin-workflow.spec.ts          # Tests workflow administrateur
└── README.md                       # Ce fichier
```

## 🎯 Couverture des Tests

### 1. Airport Autocomplete (`airport-autocomplete.spec.ts`)
- ✅ Affichage des suggestions lors de la saisie
- ✅ Sélection d'aéroport au clic
- ✅ Navigation au clavier (⬆️⬇️, Enter, Escape)
- ✅ Fermeture du dropdown avec Escape
- ✅ Message "Aucun résultat" pour recherche invalide
- ✅ Fonctionnement pour départ ET arrivée
- ✅ État de chargement

**Total: 7 tests**

### 2. Flight Number Validation (`flight-validation.spec.ts`)
- ✅ Accepte formats IATA valides (AF123, LY3456, etc.)
- ✅ Rejette formats invalides
- ✅ Conversion automatique en majuscules
- ✅ Suppression des espaces
- ✅ Message d'erreur utile avec exemple
- ✅ Disparition de l'erreur avec saisie valide
- ✅ Validation de 1 à 4 chiffres

**Total: 7 tests**

### 3. Claim Creation Flow (`claim-creation.spec.ts`)
- ✅ Flow complet de création de réclamation
- ✅ Validation des champs requis
- ✅ Auto-recherche info vol après saisie numéro
- ✅ Navigation entre étapes du formulaire

**Total: 4 tests**

### 4. Admin Workflow (`admin-workflow.spec.ts`)
- ✅ Accès au dashboard admin
- ✅ Visualisation liste réclamations
- ✅ Filtrage réclamations par statut
- ✅ Consultation détail réclamation
- ✅ Modification statut réclamation
- ✅ Recherche de réclamations
- ✅ Export CSV des réclamations
- ✅ Visualisation statistiques
- ✅ Liste des utilisateurs
- ✅ Documents en attente
- ✅ Validation de documents
- ✅ Accès paramètres admin
- ✅ Déconnexion admin

**Total: 13 tests**

## 🚀 Commandes

### Lancer tous les tests
```bash
cd apps/web
npm run test:e2e
```

### Mode UI (recommandé pour développement)
```bash
npm run test:e2e:ui
```

### Mode Debug
```bash
npm run test:e2e:debug
```

### Voir le rapport
```bash
npm run test:e2e:report
```

### Lancer un fichier spécifique
```bash
npx playwright test e2e/airport-autocomplete.spec.ts
```

### Lancer un test spécifique
```bash
npx playwright test -g "should show suggestions"
```

## 📋 Prérequis

### 1. Serveurs démarrés

**Backend API** (port 3001):
```bash
cd apps/api
npm run start:dev
```

**Frontend Web** (port 3000):
```bash
cd apps/web
npm run dev
```

**OU tout en même temps:**
```bash
# À la racine du monorepo
pnpm dev
```

### 2. Base de données

Assurez-vous que PostgreSQL est démarré et que les migrations sont appliquées:
```bash
cd apps/api
npx prisma migrate deploy
```

### 3. Données de test

Pour les tests admin, assurez-vous d'avoir un compte admin:
- Email: `tehilaoualid@gmail.com`
- Password: `admin123` (ajuster dans le test si différent)

## 🎓 Écrire de Nouveaux Tests

### Template de base

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup avant chaque test
    await page.goto('/fr/your-page');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const button = page.locator('button:has-text("Click me")');

    // Act
    await button.click();

    // Assert
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

### Bonnes pratiques

1. **Sélecteurs robustes**: Préférer les sélecteurs texte ou data-testid
```typescript
// ✅ Bon
await page.click('button:has-text("Soumettre")');
await page.click('[data-testid="submit-button"]');

// ❌ Éviter
await page.click('.btn-primary.mt-4');
```

2. **Attentes explicites**: Toujours attendre les éléments
```typescript
// ✅ Bon
await page.waitForSelector('text=Chargé', { timeout: 5000 });
await expect(page.locator('text=Chargé')).toBeVisible();

// ❌ Éviter
await page.waitForTimeout(3000);
```

3. **Isolation des tests**: Chaque test doit être indépendant
```typescript
// ✅ Bon
test.beforeEach(async ({ page }) => {
  await page.goto('/fr/claims/new');
  // Reset state if needed
});

// ❌ Éviter les dépendances entre tests
```

4. **Données uniques**: Utiliser timestamps pour éviter conflits
```typescript
const uniqueEmail = `test.${Date.now()}@example.com`;
```

## 🐛 Debugging

### 1. Mode Debug
```bash
npm run test:e2e:debug
```

### 2. Mode UI
```bash
npm run test:e2e:ui
```

### 3. Screenshots on Failure
Les screenshots sont automatiquement capturés en cas d'échec dans:
```
test-results/
```

### 4. Traces
Les traces Playwright sont capturées lors du premier retry:
```bash
npx playwright show-trace trace.zip
```

### 5. Mode Headed
Voir le navigateur pendant l'exécution:
```bash
npx playwright test --headed
```

## 📊 CI/CD

### GitHub Actions (exemple)

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps chromium

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## 📈 Métriques de Couverture

**Total des tests**: 31 tests
- Airport Autocomplete: 7 tests
- Flight Validation: 7 tests
- Claim Creation: 4 tests
- Admin Workflow: 13 tests

**Couverture des flows critiques**: 100%
- ✅ Création réclamation complète
- ✅ Autocomplete aéroports
- ✅ Validation format vol
- ✅ Workflow admin complet

## 🔧 Configuration

Configuration dans `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## 🎯 Tests à Ajouter (Futur)

- [ ] Tests mobile (viewport responsive)
- [ ] Tests cross-browser (Firefox, Safari)
- [ ] Tests performance (Lighthouse)
- [ ] Tests accessibilité (ARIA)
- [ ] Tests upload documents
- [ ] Tests download documents
- [ ] Tests multi-langue (FR/HE/EN)
- [ ] Tests notifications
- [ ] Tests erreurs réseau

## 📚 Ressources

- [Documentation Playwright](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Debugging Guide](https://playwright.dev/docs/debug)

---

**Créé le**: 28 Octobre 2025
**Dernière mise à jour**: 28 Octobre 2025
**Version**: 1.0.0
**Statut**: ✅ Configuration complète, tests prêts à exécuter
