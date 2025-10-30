#!/bin/bash

# Simple image generation script using ImageMagick
# Install ImageMagick: sudo apt-get install imagemagick (Linux) or brew install imagemagick (Mac)

echo "🎨 Generating SEO images for SkyLex..."

# Create directories
mkdir -p ../public/images
mkdir -p ../public/icons

# Colors
BLUE="#2563eb"
PURPLE="#7c3aed"
WHITE="#ffffff"

# Function to check if ImageMagick is installed
check_imagemagick() {
  if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found!"
    echo "Install it with:"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  macOS: brew install imagemagick"
    echo "  Or use the Node.js script instead: npm install canvas && node scripts/generate-images.js"
    exit 1
  fi
}

# Generate Open Graph image (1200x630)
generate_og_image() {
  echo "📸 Creating Open Graph image (1200x630)..."

  convert -size 1200x630 \
    gradient:"$BLUE"-"$PURPLE" \
    -font Arial-Bold -pointsize 72 -fill white -gravity center \
    -annotate +0-50 "SkyLex" \
    -font Arial -pointsize 36 -annotate +0+30 "Réclamez jusqu'à 600€ pour votre vol" \
    -font Arial -pointsize 24 -annotate +0+120 "Vol Retardé • Vol Annulé • Refus d'Embarquement" \
    -quality 95 ../public/images/og-image.jpg

  echo "✅ Open Graph image created"
}

# Generate Twitter Card image (1200x675)
generate_twitter_image() {
  echo "📸 Creating Twitter Card image (1200x675)..."

  convert -size 1200x675 \
    gradient:"$BLUE"-"$PURPLE" \
    -font Arial-Bold -pointsize 80 -fill white -gravity center \
    -annotate +0-80 "SkyLex" \
    -font Arial -pointsize 40 -annotate +0+0 "Flight Compensation Experts" \
    -font Arial-Bold -pointsize 32 -annotate -350+100 "98% Success" \
    -annotate +0+100 "12K+ Clients" \
    -annotate +350+100 "€4.8M Recovered" \
    -quality 95 ../public/images/twitter-image.jpg

  echo "✅ Twitter Card image created"
}

# Generate PWA icons
generate_pwa_icons() {
  echo "📱 Creating PWA icons..."

  sizes=(72 96 128 144 152 192 384 512)

  for size in "${sizes[@]}"; do
    convert -size ${size}x${size} \
      gradient:"$BLUE"-"$PURPLE" \
      \( +clone -alpha extract \
         -draw "fill black polygon 0,0 0,15 15,0 fill white circle ${size},${size} ${size},0" \
         \( +clone -flip \) -compose Multiply -composite \
         \( +clone -flop \) -compose Multiply -composite \
      \) -alpha off -compose CopyOpacity -composite \
      -font Arial-Bold -pointsize $((size/3)) -fill white -gravity center \
      -annotate +0+0 "✈" \
      ../public/icons/icon-${size}x${size}.png

    echo "  ✓ Icon ${size}x${size} created"
  done

  echo "✅ All PWA icons created"
}

# Generate favicon
generate_favicon() {
  echo "🌟 Creating favicon..."

  convert -size 64x64 \
    gradient:"$BLUE"-"$PURPLE" \
    -font Arial-Bold -pointsize 32 -fill white -gravity center \
    -annotate +0+0 "S" \
    ../public/favicon.ico

  echo "✅ Favicon created"
}

# Generate Apple Touch Icon (convert from SVG)
generate_apple_icon() {
  echo "🍎 Creating Apple Touch Icon..."

  convert -size 180x180 \
    gradient:"$BLUE"-"$PURPLE" \
    -font Arial-Bold -pointsize 80 -fill white -gravity center \
    -annotate +0+0 "✈" \
    ../public/apple-touch-icon.png

  echo "✅ Apple Touch Icon created"
}

# Main execution
main() {
  check_imagemagick

  echo ""
  echo "================================"
  echo "  SkyLex Image Generator"
  echo "================================"
  echo ""

  generate_og_image
  generate_twitter_image
  generate_pwa_icons
  generate_favicon
  generate_apple_icon

  echo ""
  echo "================================"
  echo "✅ All images generated successfully!"
  echo "================================"
  echo ""
  echo "Generated files:"
  echo "  📁 public/images/"
  echo "    - og-image.jpg (1200x630)"
  echo "    - twitter-image.jpg (1200x675)"
  echo "  📁 public/icons/"
  echo "    - icon-72x72.png to icon-512x512.png"
  echo "  📁 public/"
  echo "    - favicon.ico"
  echo "    - apple-touch-icon.png"
  echo "    - icon.svg (already created)"
  echo "    - logo.svg (already created)"
  echo ""
}

main
