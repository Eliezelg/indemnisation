# 🎬 INTÉGRATION COMPLÈTE DES MÉDIAS

## Guide d'intégration des vidéos et images dans le design premium

**Date** : 29 Octobre 2025

---

## 📋 RÉSUMÉ RAPIDE

### Ce qui a été fait ✅
1. ✅ Structure des dossiers créée
2. ✅ Placeholders SVG générés
3. ✅ Composant VideoBackground prêt
4. ✅ Guides de téléchargement créés
5. ✅ Prompts Sora 2 fournis

### Ce qui reste à faire 🔄
1. 🔄 Télécharger les médias (manuel ou Sora 2)
2. 🔄 Mettre à jour le code pour utiliser les médias
3. 🔄 Optimiser les médias
4. 🔄 Tester le rendu final

---

## 🎯 OPTION 1 : UTILISATION IMMÉDIATE (PLACEHOLDERS)

Le design actuel fonctionne **déjà** avec des gradients et patterns.
Pas besoin de médias externes pour avoir un rendu magnifique !

**Statut actuel** : ✅ Fonctionnel et beau

---

## 🎥 OPTION 2 : INTÉGRATION VIDÉO HERO

### Étape 1 : Télécharger la vidéo

**Choix A - Pexels (Gratuit)** :
```
URL: https://www.pexels.com/video/plane-flying-above-the-clouds-3045163/
Fichier: hero-airplane.mp4
Destination: apps/web/public/videos/hero-airplane.mp4
Taille cible: < 5MB
```

**Choix B - Sora 2 (Générer)** :
```
Prompt:
"Cinematic aerial view of a modern commercial airplane flying gracefully through
soft, dreamy clouds at golden hour. The scene is shot from above and slightly
behind the aircraft. Volumetric lighting creates god rays breaking through the
clouds. The airplane's metallic surface reflects the warm sunset tones of orange,
pink, and purple. Gentle camera movement following the plane as it glides smoothly
through the serene cloudscape. The atmosphere is peaceful yet dynamic, conveying
trust, adventure, and professionalism. Color grading: warm cinematic tones with
blue-purple undertones. 4K resolution, ultra-smooth motion, subtle depth of field."

Paramètres:
- Duration: 10-15 seconds
- Resolution: 1920x1080 or 4K
- Loop: Seamless
- Format: MP4 (H.264)
```

### Étape 2 : Optimiser la vidéo (si > 5MB)

```bash
# Avec FFmpeg
ffmpeg -i hero-airplane.mp4 -vcodec libx264 -crf 28 -preset slow \
  -vf "scale=1920:1080" -r 30 \
  apps/web/public/videos/hero-airplane-optimized.mp4

# Ou avec HandBrake (GUI)
# Preset: Fast 1080p30
# Quality: RF 24-28
```

### Étape 3 : Télécharger l'image poster (fallback)

```
URL: https://unsplash.com/photos/white-plane-in-mid-air-qDgTQOYk6B8
Fichier: airplane-poster.jpg
Destination: apps/web/public/images/hero/airplane-poster.jpg
```

### Étape 4 : Mettre à jour le code

Ouvrir `apps/web/app/[locale]/page.tsx` et trouver la section Hero.

**Remplacer cette partie** :
```typescript
{/* Background Pattern (fallback si pas de vidéo) */}
<div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900" />
<div className="absolute inset-0 opacity-10">
  <div className="absolute inset-0" style={{
    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
    backgroundSize: '40px 40px'
  }} />
</div>
```

**Par ce code** :
```typescript
{/* Video Background */}
<VideoBackground
  src="/videos/hero-airplane.mp4"
  poster="/images/hero/airplane-poster.jpg"
  overlay={true}
  overlayOpacity={0.7}
  overlayGradient="from-blue-900 via-purple-900 to-blue-900"
/>
```

✅ **C'est tout !** La vidéo sera automatiquement intégrée.

---

## 📸 OPTION 3 : INTÉGRATION IMAGES FEATURES

### Images à télécharger/générer :

#### Image 1 : Formulaire Simple
```
Source: https://unsplash.com/photos/macbook-pro-on-brown-wooden-table-376KN_ISplE
OU Sora 2 Prompt:
"Clean, modern user interface mockup showing a simple flight claim form on a
laptop screen. Three elegant input fields with soft shadows. Minimalist office
desk with natural lighting. Color scheme: blue and white with purple accents.
Shot from above at 45° angle. Depth of field effect. Professional product
photography style."

Destination: apps/web/public/images/features/simple-form.jpg
```

#### Image 2 : Équipe Support
```
Source: https://unsplash.com/photos/woman-sitting-beside-table-using-laptop-IgUR1iX0mqM
OU Sora 2 Prompt:
"Professional diverse customer support team working in a modern bright office.
Three people collaborating around a desk with laptops. Natural smiles, business
casual attire. Large windows with natural light. Warm and welcoming atmosphere
with blue accents. Shot with shallow depth of field."

Destination: apps/web/public/images/features/expert-team.jpg
```

#### Image 3 : Succès
```
Source: https://unsplash.com/photos/smiling-man-using-black-smartphone-tYvr1_4lM1I
OU Sora 2 Prompt:
"Happy professional person receiving good news on their phone, subtle smile of
satisfaction. Modern minimalist setting with soft natural light. Blue and white
color scheme. Success, relief, and satisfaction. Clean professional portrait
photography style with bokeh background."

Destination: apps/web/public/images/features/success-celebration.jpg
```

### Code à ajouter (OPTIONNEL)

Si vous voulez afficher ces images dans les cards :

```typescript
// Dans la section "How it Works" ou "Benefits"
import Image from 'next/image';

<PremiumCard
  icon={<span className="text-2xl font-bold text-white">1</span>}
  title={t('step1Title')}
  description={t('step1Description')}
  hover={true}
  gradient={true}
>
  {/* Ajouter l'image en dessous */}
  <div className="relative w-full h-48 mt-4 rounded-xl overflow-hidden">
    <Image
      src="/images/features/simple-form.jpg"
      alt="Formulaire simple"
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  </div>
</PremiumCard>
```

---

## 🎨 OPTION 4 : SECTION FEATURES AVEC IMAGES

Créons une nouvelle section "Features avec Images" plus visuelle :

### Composant FeatureWithImage

Créer `apps/web/components/premium/FeatureWithImage.tsx` :

```typescript
'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface FeatureWithImageProps {
  title: string;
  description: string;
  image: string;
  icon: ReactNode;
  reverse?: boolean;
}

export default function FeatureWithImage({
  title,
  description,
  image,
  icon,
  reverse = false,
}: FeatureWithImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-12`}
    >
      {/* Image */}
      <div className="w-full md:w-1/2 relative">
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl group">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Content */}
      <div className="w-full md:w-1/2">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            {icon}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            {title}
          </h3>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
```

### Utilisation dans page.tsx

Ajouter après la section "Stats" :

```typescript
{/* Features avec Images Section */}
<section className="py-20 bg-white">
  <div className="container mx-auto px-4 sm:px-6">
    <div className="text-center mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
        Comment ça marche
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Un processus simple et transparent en 3 étapes
      </p>
    </div>

    <div className="max-w-6xl mx-auto space-y-20">
      <FeatureWithImage
        title="1. Remplissez le formulaire"
        description="En moins de 3 minutes, fournissez les informations de votre vol. Notre système intelligent calcule automatiquement votre indemnisation."
        image="/images/features/simple-form.jpg"
        icon={<span className="text-white text-2xl font-bold">1</span>}
        reverse={false}
      />

      <FeatureWithImage
        title="2. Notre équipe s'occupe de tout"
        description="Des experts juridiques spécialisés en droit aérien prennent en charge votre dossier. Vous n'avez plus rien à faire."
        image="/images/features/expert-team.jpg"
        icon={<span className="text-white text-2xl font-bold">2</span>}
        reverse={true}
      />

      <FeatureWithImage
        title="3. Recevez votre indemnisation"
        description="Une fois approuvée, l'indemnisation est versée directement sur votre compte. En moyenne, le processus prend 2 à 4 semaines."
        image="/images/features/success-celebration.jpg"
        icon={<span className="text-white text-2xl font-bold">3</span>}
        reverse={false}
      />
    </div>
  </div>
</section>
```

---

## 🎬 OPTION 5 : SECTION TESTIMONIALS (BONUS)

### Télécharger 3 avatars professionnels

**Sources** :
```
1. https://unsplash.com/photos/man-wearing-blue-crew-neck-top-sibVwORYqs0
   → Destination: images/testimonials/client-1.jpg

2. https://unsplash.com/photos/woman-wearing-black-scoop-neck-long-sleeved-shirt-mEZ3PoFGs_k
   → Destination: images/testimonials/client-2.jpg

3. https://unsplash.com/photos/man-in-white-dress-shirt-wearing-black-framed-eyeglasses-7YVZYZeITc8
   → Destination: images/testimonials/client-3.jpg
```

### Composant Testimonial

Créer `apps/web/components/premium/TestimonialCard.tsx` :

```typescript
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Check } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  location: string;
  avatar: string;
  quote: string;
  amount: string;
  delay?: number;
}

export default function TestimonialCard({
  name,
  location,
  avatar,
  quote,
  amount,
  delay = 0,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-shadow"
    >
      {/* Stars */}
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-700 mb-6 italic leading-relaxed">
        "{quote}"
      </p>

      {/* Author */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{location}</div>
        </div>
      </div>

      {/* Amount badge */}
      <div className="pt-6 border-t border-gray-100">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
          <Check className="w-4 h-4 mr-1" />
          {amount} récupérés
        </div>
      </div>
    </motion.div>
  );
}
```

### Section Testimonials dans page.tsx

```typescript
{/* Testimonials Section */}
<section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
  <div className="container mx-auto px-4 sm:px-6">
    <div className="text-center mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
        Témoignages clients
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Découvrez les expériences de nos clients satisfaits
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <TestimonialCard
        name="Sophie Martin"
        location="Paris, France"
        avatar="/images/testimonials/client-1.jpg"
        quote="J'ai récupéré 600€ pour mon vol annulé vers Barcelone. Le processus était simple et l'équipe très professionnelle."
        amount="600€"
        delay={0}
      />
      <TestimonialCard
        name="David Cohen"
        location="Tel Aviv, Israël"
        avatar="/images/testimonials/client-2.jpg"
        quote="Service exceptionnel ! Mon indemnisation a été traitée en moins de 3 semaines. Je recommande vivement."
        amount="400€"
        delay={0.1}
      />
      <TestimonialCard
        name="Marie Dubois"
        location="Lyon, France"
        avatar="/images/testimonials/client-3.jpg"
        quote="Vol retardé de 5 heures, 600€ récupérés sans effort. Merci pour votre professionnalisme !"
        amount="600€"
        delay={0.2}
      />
    </div>
  </div>
</section>
```

---

## 📊 CHECKLIST FINALE D'INTÉGRATION

### Phase 1 : Médias Essentiels
- [ ] Télécharger/Générer vidéo Hero (`hero-airplane.mp4`)
- [ ] Télécharger image poster Hero (`airplane-poster.jpg`)
- [ ] Intégrer VideoBackground dans page.tsx
- [ ] Tester le rendu Hero

### Phase 2 : Images Features
- [ ] Télécharger 3 images features
- [ ] Créer composant FeatureWithImage
- [ ] Ajouter section Features avec images
- [ ] Tester responsive

### Phase 3 : Testimonials (Optionnel)
- [ ] Télécharger 3 avatars
- [ ] Créer composant TestimonialCard
- [ ] Ajouter section Testimonials
- [ ] Personnaliser les témoignages

### Phase 4 : Optimisation
- [ ] Compresser vidéo (< 5MB)
- [ ] Optimiser images (TinyPNG)
- [ ] Vérifier performance (Lighthouse)
- [ ] Tester sur mobile

---

## 🚀 COMMANDES RAPIDES

### Test local
```bash
cd /home/eli/Documents/indemnisation
npm run dev
# Ouvrir http://localhost:3000
```

### Créer placeholders
```bash
./scripts/download-media.sh
```

### Vérifier structure
```bash
tree apps/web/public/
```

### Optimiser vidéo
```bash
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow \
  -vf "scale=1920:1080" output.mp4
```

---

## 💡 RECOMMANDATIONS FINALES

### Priorité 1 (Must Have) :
1. ✅ Vidéo Hero OU gradient actuel (les deux sont beaux)
2. ✅ Design premium déjà en place

### Priorité 2 (Nice to Have) :
3. 🔄 Images Features pour section avec photos
4. 🔄 Optimisation performance

### Priorité 3 (Optional) :
5. ⏳ Section Testimonials
6. ⏳ Logos compagnies
7. ⏳ Blog/Resources

---

## 📞 PROCHAINES ÉTAPES

**Option A - Rapide** :
Gardez le design actuel (gradients) → C'est déjà magnifique ! ✨

**Option B - Premium** :
1. Téléchargez les médias depuis les liens fournis
2. Placez-les dans `/public/`
3. Activez VideoBackground dans page.tsx
4. Ajoutez les sections bonus (Features, Testimonials)

**Option C - Ultra Premium** :
1. Générez tout avec Sora 2 (prompts fournis)
2. Intégration complète custom
3. Testimonials avec vraies photos

---

## ✨ CONCLUSION

Vous avez maintenant :
- ✅ **Design premium fonctionnel** (sans médias externes)
- ✅ **Tous les prompts Sora 2** (génération custom)
- ✅ **Liens de téléchargement** (médias gratuits)
- ✅ **Code d'intégration complet** (copy-paste ready)
- ✅ **Composants bonus** (Features, Testimonials)

**Le design est déjà WOW, les médias le rendront ULTRA WOW !** 🚀✨

Dites-moi quelle option vous préférez et je vous aide à l'implémenter ! 🎨
