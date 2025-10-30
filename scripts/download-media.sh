#!/bin/bash

# Script de téléchargement automatique des médias premium
# Note: Certaines sources nécessitent un téléchargement manuel depuis le navigateur

echo "🎬 Téléchargement des médias premium pour SkyLex"
echo "============================================================="
echo ""

# Créer les dossiers si nécessaire
mkdir -p apps/web/public/videos
mkdir -p apps/web/public/images/hero
mkdir -p apps/web/public/images/features
mkdir -p apps/web/public/images/backgrounds

cd apps/web/public

echo "📁 Structure des dossiers créée ✅"
echo ""

# Note: Pour Pexels et Unsplash, le téléchargement direct nécessite leurs APIs
# Ce script montre les commandes, mais vous devrez télécharger manuellement

echo "📝 Instructions de téléchargement manuel :"
echo ""
echo "1. VIDÉO HERO (Priorité 1) :"
echo "   - Aller sur : https://www.pexels.com/video/plane-flying-above-the-clouds-3045163/"
echo "   - Cliquer 'Free Download' → Full HD"
echo "   - Sauvegarder dans : videos/hero-airplane.mp4"
echo ""

echo "2. IMAGE HERO POSTER (Priorité 1) :"
echo "   - Aller sur : https://unsplash.com/photos/white-plane-in-mid-air-qDgTQOYk6B8"
echo "   - Cliquer 'Download free'"
echo "   - Sauvegarder dans : images/hero/airplane-poster.jpg"
echo ""

echo "3. IMAGES FEATURES (Priorité 2) :"
echo "   a) Formulaire simple :"
echo "      - https://unsplash.com/photos/macbook-pro-on-brown-wooden-table-376KN_ISplE"
echo "      - Sauvegarder dans : images/features/simple-form.jpg"
echo ""
echo "   b) Équipe support :"
echo "      - https://unsplash.com/photos/woman-sitting-beside-table-using-laptop-IgUR1iX0mqM"
echo "      - Sauvegarder dans : images/features/expert-team.jpg"
echo ""
echo "   c) Succès :"
echo "      - https://unsplash.com/photos/smiling-man-using-black-smartphone-tYvr1_4lM1I"
echo "      - Sauvegarder dans : images/features/success-celebration.jpg"
echo ""

# Créer des images placeholder si besoin
echo "🎨 Création de placeholders SVG (en attendant les vraies images)..."

# Placeholder Hero
cat > images/hero/placeholder-hero.svg << 'EOF'
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect fill="url(#grad1)" width="1920" height="1080"/>
  <text x="50%" y="50%" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle">
    Hero Background Placeholder
  </text>
</svg>
EOF

echo "✅ Placeholder Hero créé : images/hero/placeholder-hero.svg"

# Placeholder Features
for i in 1 2 3; do
  cat > images/features/placeholder-feature-$i.svg << EOF
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad$i" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9333ea;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect fill="url(#grad$i)" width="800" height="600" opacity="0.1"/>
  <text x="50%" y="50%" font-family="Arial" font-size="32" fill="#374151" text-anchor="middle" dominant-baseline="middle">
    Feature $i Placeholder
  </text>
</svg>
EOF
done

echo "✅ Placeholders Features créés (3)"

# Pattern background
cat > images/backgrounds/pattern-dots.svg << 'EOF'
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1" fill="#3b82f6" opacity="0.1"/>
  </pattern>
  <rect fill="url(#dots)" width="100" height="100"/>
</svg>
EOF

echo "✅ Pattern créé : images/backgrounds/pattern-dots.svg"

echo ""
echo "============================================================="
echo "✅ Script terminé !"
echo ""
echo "📋 PROCHAINES ÉTAPES :"
echo "1. Télécharger manuellement les images depuis les liens ci-dessus"
echo "2. OU utiliser les placeholders SVG temporaires"
echo "3. OU générer avec Sora 2 en utilisant les prompts du guide"
echo ""
echo "📂 Vérifier la structure avec : tree apps/web/public/"
echo ""
echo "🚀 Une fois les médias en place, l'intégration sera automatique !"
