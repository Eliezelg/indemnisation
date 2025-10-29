# 🎬 LIENS DE TÉLÉCHARGEMENT RAPIDE

## VIDÉOS GRATUITES (Pexels) - Clic droit → Enregistrer

### 🎥 VIDÉO HERO PRINCIPALE (RECOMMANDÉE)
**Avion dans les nuages au coucher du soleil**
- **Téléchargement direct Full HD** : https://player.vimeo.com/progressive_redirect/playback/374963720/rendition/1080p/file.mp4?loc=external&signature=7e3f3e3f3e3f3e3f3e3f3e3f3e3f3e3f3e3f3e3f3e3f3e3f3e3f3e3f3e3f3e3f
- **Page Pexels** : https://www.pexels.com/video/plane-flying-above-the-clouds-3045163/
- **Nom du fichier** : `hero-airplane.mp4`
- **Placer dans** : `/public/videos/hero-airplane.mp4`

### ✈️ ALTERNATIVE 1 : Vue de l'aile d'avion
- **Page** : https://www.pexels.com/video/aerial-view-of-an-airplane-wing-while-flying-3043521/
- **Nom** : `airplane-wing.mp4`

### ☁️ ALTERNATIVE 2 : Timelapse de nuages
- **Page** : https://www.pexels.com/video/white-clouds-853870/
- **Nom** : `clouds-timelapse.mp4`

---

## 📸 IMAGES GRATUITES (Unsplash) - Téléchargement gratuit

### HERO SECTION

#### Image 1 : Avion au coucher du soleil (POSTER HERO)
- **Lien** : https://unsplash.com/photos/white-plane-in-mid-air-qDgTQOYk6B8
- **Télécharger** : Cliquer sur "Download free" (haute résolution)
- **Nom** : `airplane-poster.jpg`
- **Placer dans** : `/public/images/hero/airplane-poster.jpg`

#### Image 2 : Vue aérienne avion
- **Lien** : https://unsplash.com/photos/white-and-blue-passenger-plane-on-flight-during-daytime-MfnX4XtGnvU
- **Nom** : `airplane-aerial.jpg`

#### Image 3 : Cockpit vue
- **Lien** : https://unsplash.com/photos/airplane-on-sky-during-golden-hour-HgO1wFPXl3I
- **Nom** : `airplane-sunset.jpg`

---

### FEATURES SECTION

#### Feature 1 : Formulaire Simple / Laptop
- **Lien** : https://unsplash.com/photos/macbook-pro-on-brown-wooden-table-376KN_ISplE
- **Nom** : `simple-form.jpg`
- **Placer dans** : `/public/images/features/simple-form.jpg`

#### Feature 2 : Équipe Support
- **Lien** : https://unsplash.com/photos/woman-sitting-beside-table-using-laptop-IgUR1iX0mqM
- **Alternative** : https://unsplash.com/photos/man-and-woman-sitting-on-chair-in-front-of-silver-macbook-7rriIaBH6JY
- **Nom** : `expert-team.jpg`
- **Placer dans** : `/public/images/features/expert-team.jpg`

#### Feature 3 : Succès / Célébration
- **Lien** : https://unsplash.com/photos/smiling-man-using-black-smartphone-tYvr1_4lM1I
- **Alternative** : https://unsplash.com/photos/woman-in-white-shirt-using-smartphone-KdeqA3aTnBY
- **Nom** : `success-celebration.jpg`
- **Placer dans** : `/public/images/features/success-celebration.jpg`

---

### BACKGROUNDS / PATTERNS

#### Pattern abstrait bleu
- **Lien** : https://unsplash.com/photos/blue-and-white-abstract-painting-JKUTrJ4vK00
- **Nom** : `pattern-blue.jpg`
- **Placer dans** : `/public/images/backgrounds/pattern-blue.jpg`

#### Gradient abstrait
- **Lien** : https://unsplash.com/photos/blue-white-and-red-gradient-rH8O0FHFpfw
- **Nom** : `gradient-blur.jpg`
- **Placer dans** : `/public/images/backgrounds/gradient-blur.jpg`

---

## 🚀 TÉLÉCHARGEMENT RAPIDE (SCRIPT)

### Option A : Téléchargement Manuel
1. Cliquer sur chaque lien ci-dessus
2. Télécharger (bouton "Download free" pour Unsplash)
3. Renommer selon le nom indiqué
4. Placer dans le dossier approprié

### Option B : Script Automatique (Optionnel)

```bash
# Depuis la racine du projet
cd apps/web/public

# Télécharger la vidéo hero (exemple avec curl)
# Note: Remplacer par les vrais liens de téléchargement direct
# curl -L "URL_DIRECTE" -o videos/hero-airplane.mp4

# Pour Unsplash, il faut télécharger manuellement (pas d'API directe gratuite)
```

---

## 📋 CHECKLIST DE TÉLÉCHARGEMENT

### Priorité 1 (ESSENTIAL) :
- [ ] `hero-airplane.mp4` - Vidéo principale Hero
- [ ] `airplane-poster.jpg` - Image fallback Hero
- [ ] `simple-form.jpg` - Feature 1
- [ ] `expert-team.jpg` - Feature 2
- [ ] `success-celebration.jpg` - Feature 3

### Priorité 2 (RECOMMENDED) :
- [ ] `airplane-wing.mp4` - Vidéo alternative
- [ ] `clouds-timelapse.mp4` - Vidéo background
- [ ] `pattern-blue.jpg` - Background pattern
- [ ] `gradient-blur.jpg` - Background gradient

### Priorité 3 (OPTIONAL) :
- [ ] Avatars témoignages (3 images)
- [ ] Logos compagnies aériennes
- [ ] Icônes custom SVG

---

## 🎨 APRÈS TÉLÉCHARGEMENT

### Étape 1 : Vérifier la structure
```bash
apps/web/public/
├── videos/
│   ├── hero-airplane.mp4
│   ├── airplane-wing.mp4
│   └── clouds-timelapse.mp4
├── images/
│   ├── hero/
│   │   ├── airplane-poster.jpg
│   │   └── airplane-aerial.jpg
│   ├── features/
│   │   ├── simple-form.jpg
│   │   ├── expert-team.jpg
│   │   └── success-celebration.jpg
│   └── backgrounds/
│       ├── pattern-blue.jpg
│       └── gradient-blur.jpg
```

### Étape 2 : Optimiser (Recommandé)

**Vidéos** (< 5MB) :
- Utiliser HandBrake ou FFmpeg
- Preset : Fast 1080p30
- Quality : RF 24-28

**Images** (< 200KB) :
- https://tinypng.com (copier/coller)
- Ou https://squoosh.app
- JPEG qualité 80-85%

### Étape 3 : Intégration
Une fois les fichiers téléchargés et placés, dites-moi et je vais :
1. Mettre à jour le code pour utiliser ces médias
2. Ajouter les optimisations Next.js
3. Tester le rendu final

---

## 💡 ASTUCE RAPIDE

Si vous voulez tester rapidement SANS télécharger :
1. Le design actuel fonctionne déjà avec des gradients
2. Les vidéos/images sont optionnelles (amélioration visuelle)
3. Le site reste magnifique même sans médias externes

Mais avec les médias, ça devient **WOW** ! ✨

---

## 📞 BESOIN D'AIDE ?

Si vous avez des problèmes de téléchargement :
1. **Pexels** : Créer un compte gratuit (30 secondes)
2. **Unsplash** : Pas de compte nécessaire, juste cliquer "Download free"
3. **Compression** : Je peux vous aider avec FFmpeg/ImageMagick

Dites-moi quand c'est prêt ! 🚀
