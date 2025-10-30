# Scripts de Génération d'Images SEO

Ce dossier contient des scripts pour générer automatiquement toutes les images nécessaires pour l'optimisation SEO de SkyLex.

## 📁 Fichiers

### 1. `generate-images.js`
Script Node.js utilisant la bibliothèque Canvas pour générer des images de haute qualité.

**Avantages:**
- ✅ Qualité professionnelle
- ✅ Personnalisation avancée
- ✅ Gradients et effets visuels
- ✅ Fonctionne sur tous les OS

**Installation:**
```bash
cd apps/web
npm install canvas
```

**Utilisation:**
```bash
node scripts/generate-images.js
```

### 2. `generate-simple-images.sh`
Script Bash utilisant ImageMagick (plus simple, mais nécessite ImageMagick).

**Installation d'ImageMagick:**
```bash
# Ubuntu/Debian
sudo apt-get install imagemagick

# macOS
brew install imagemagick

# Windows
# Télécharger depuis: https://imagemagick.org/script/download.php
```

**Utilisation:**
```bash
cd scripts
chmod +x generate-simple-images.sh
./generate-simple-images.sh
```

### 3. Icônes SVG
Déjà créées et prêtes à l'emploi:
- `public/icon.svg` - Icône principale
- `public/apple-touch-icon.svg` - Icône Apple
- `public/logo.svg` - Logo avec texte

## 🎨 Images Générées

### Images Social Media
- **og-image.jpg** (1200x630) - Open Graph (Facebook, LinkedIn)
- **twitter-image.jpg** (1200x675) - Twitter Card

### Icônes PWA
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

### Autres
- favicon.ico (64x64)
- apple-touch-icon.png (180x180)

## 🚀 Méthode Recommandée

### Option 1: Utiliser le script Node.js (RECOMMANDÉ)

```bash
# 1. Installer Canvas
cd apps/web
npm install canvas

# 2. Générer les images
node scripts/generate-images.js

# 3. Vérifier les images
ls -la public/images/
ls -la public/icons/
```

### Option 2: Utiliser ImageMagick

```bash
# 1. Installer ImageMagick
brew install imagemagick  # macOS
# ou
sudo apt-get install imagemagick  # Linux

# 2. Rendre le script exécutable
cd apps/web/scripts
chmod +x generate-simple-images.sh

# 3. Exécuter
./generate-simple-images.sh
```

### Option 3: Créer manuellement avec un outil de design

Si vous préférez créer les images manuellement avec Figma, Photoshop, ou Canva:

**Spécifications:**

#### Open Graph Image (og-image.jpg)
- **Dimensions**: 1200 x 630 px
- **Format**: JPG, qualité 95%
- **Contenu**:
  - Logo SkyLex au centre
  - Titre: "SkyLex"
  - Sous-titre: "Réclamez jusqu'à 600€ pour votre vol"
  - Texte secondaire: "Vol Retardé • Vol Annulé • Refus d'Embarquement"
- **Couleurs**: Gradient bleu (#2563eb) vers violet (#7c3aed)

#### Twitter Card Image (twitter-image.jpg)
- **Dimensions**: 1200 x 675 px
- **Format**: JPG, qualité 95%
- **Contenu**:
  - Titre: "SkyLex"
  - Sous-titre: "Flight Compensation Experts"
  - Stats: "98% Success Rate | 12K+ Clients | €4.8M Recovered"
- **Couleurs**: Gradient bleu (#2563eb) vers violet (#7c3aed)

#### PWA Icons
- **Dimensions**: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- **Format**: PNG avec transparence
- **Contenu**: Logo avion sur fond gradient avec coins arrondis
- **Couleurs**: Gradient bleu (#2563eb) vers violet (#7c3aed)

## 🎯 Templates Figma/Canva

Si vous voulez utiliser un outil de design visuel, voici les templates recommandés:

### Template Figma
1. Créer un nouveau projet Figma
2. Importer les dimensions ci-dessus
3. Utiliser le gradient: `linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%)`
4. Ajouter l'icône d'avion (✈️) ou utiliser une icône de plane de Heroicons
5. Exporter en JPG (social) ou PNG (icons)

### Template Canva
1. Aller sur canva.com
2. Créer un design personnalisé avec les dimensions
3. Utiliser le gradient bleu-violet
4. Ajouter le texte "SkyLex" en bold
5. Télécharger en JPG/PNG

## 📋 Checklist Après Génération

Vérifiez que ces fichiers existent:

```bash
# Images social media
[ ] public/images/og-image.jpg (1200x630)
[ ] public/images/twitter-image.jpg (1200x675)

# Icônes PWA
[ ] public/icons/icon-72x72.png
[ ] public/icons/icon-96x96.png
[ ] public/icons/icon-128x128.png
[ ] public/icons/icon-144x144.png
[ ] public/icons/icon-152x152.png
[ ] public/icons/icon-192x192.png
[ ] public/icons/icon-384x384.png
[ ] public/icons/icon-512x512.png

# Autres icônes
[ ] public/favicon.ico
[ ] public/icon.svg ✅
[ ] public/apple-touch-icon.png
[ ] public/logo.svg ✅
```

## 🔍 Test des Images

### 1. Test Open Graph
- Aller sur: https://www.opengraph.xyz/
- Entrer l'URL: https://skylex.com
- Vérifier l'aperçu

### 2. Test Twitter Card
- Aller sur: https://cards-dev.twitter.com/validator
- Entrer l'URL: https://skylex.com
- Vérifier l'aperçu

### 3. Test PWA Icons
- Ouvrir Chrome DevTools
- Onglet "Application" > "Manifest"
- Vérifier que toutes les icônes sont chargées

## ❓ Dépannage

### Erreur: Canvas not found
```bash
npm install canvas
# Si erreur de compilation:
npm install --build-from-source canvas
```

### Erreur: ImageMagick not found
```bash
# Vérifier l'installation
which convert
# Si pas trouvé, installer:
brew install imagemagick  # macOS
sudo apt-get install imagemagick  # Linux
```

### Images floues ou de mauvaise qualité
- Augmenter la qualité JPEG à 95%
- Vérifier les dimensions exactes
- S'assurer d'utiliser la bonne résolution (pas de upscaling)

## 📞 Support

Pour toute question, consultez:
- Documentation SEO complète: `docs/SEO_IMPLEMENTATION.md`
- Guide rapide: `docs/SEO_QUICK_START.md`

---

**Note**: Les icônes SVG sont déjà créées et optimisées. Vous n'avez besoin de générer que les images raster (JPG/PNG).
