/**
 * Script to generate SEO images using Canvas (Node.js)
 * Run: node scripts/generate-images.js
 */

const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const publicDir = path.join(__dirname, '..', 'public');
const imagesDir = path.join(publicDir, 'images');
const iconsDir = path.join(publicDir, 'icons');

[imagesDir, iconsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Function to create gradient background
function createGradientBackground(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#2563eb');    // blue-600
  gradient.addColorStop(0.5, '#7c3aed');  // purple-600
  gradient.addColorStop(1, '#2563eb');    // blue-600
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

// Function to add text with shadow
function addTextWithShadow(ctx, text, x, y, fontSize, color = '#ffffff', align = 'center') {
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';

  // Shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = color;
  ctx.fillText(text, x, y);

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

// Generate Open Graph image (1200x630)
function generateOGImage() {
  console.log('Generating Open Graph image...');

  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background gradient
  createGradientBackground(ctx, width, height);

  // Add logo circle
  const logoSize = 120;
  const logoX = width / 2;
  const logoY = 180;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.beginPath();
  ctx.arc(logoX, logoY, logoSize, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(logoX, logoY, logoSize - 10, 0, Math.PI * 2);
  ctx.fill();

  // Draw airplane icon (simplified)
  ctx.fillStyle = '#2563eb';
  ctx.save();
  ctx.translate(logoX, logoY);
  ctx.rotate(-0.3);
  ctx.fillRect(-40, -8, 80, 16);
  ctx.fillRect(-30, -25, 10, 50);
  ctx.fillRect(20, -15, 10, 30);
  ctx.restore();

  // Main title
  addTextWithShadow(ctx, 'SkyLex', width / 2, 340, 72);

  // Subtitle
  addTextWithShadow(ctx, 'Réclamez jusqu\'à 600€ pour votre vol', width / 2, 420, 36);

  // Bottom text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '24px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Vol Retardé • Vol Annulé • Refus d\'Embarquement', width / 2, 520);

  // Save
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(path.join(imagesDir, 'og-image.jpg'), buffer);
  console.log('✓ Open Graph image created: public/images/og-image.jpg');
}

// Generate Twitter Card image (1200x675)
function generateTwitterImage() {
  console.log('Generating Twitter Card image...');

  const width = 1200;
  const height = 675;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background gradient
  createGradientBackground(ctx, width, height);

  // Main title
  addTextWithShadow(ctx, 'SkyLex', width / 2, height / 2 - 80, 80);

  // Subtitle
  addTextWithShadow(ctx, 'Flight Compensation Experts', width / 2, height / 2, 40);

  // Stats
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.textAlign = 'center';

  const statsY = height / 2 + 100;
  ctx.fillText('98% Success Rate', width / 2 - 250, statsY);
  ctx.fillText('12K+ Clients', width / 2, statsY);
  ctx.fillText('€4.8M Recovered', width / 2 + 250, statsY);

  // Save
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(path.join(imagesDir, 'twitter-image.jpg'), buffer);
  console.log('✓ Twitter Card image created: public/images/twitter-image.jpg');
}

// Generate PWA icons
function generatePWAIcon(size) {
  console.log(`Generating ${size}x${size} icon...`);

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background with gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#2563eb');
  gradient.addColorStop(0.5, '#7c3aed');
  gradient.addColorStop(1, '#2563eb');
  ctx.fillStyle = gradient;

  // Rounded corners
  const radius = size * 0.15;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();

  // Draw airplane icon (simplified)
  ctx.fillStyle = '#ffffff';
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(-0.3);

  const scale = size / 200;
  ctx.fillRect(-40 * scale, -8 * scale, 80 * scale, 16 * scale);
  ctx.fillRect(-30 * scale, -25 * scale, 10 * scale, 50 * scale);
  ctx.fillRect(20 * scale, -15 * scale, 10 * scale, 30 * scale);
  ctx.restore();

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), buffer);
  console.log(`✓ Icon ${size}x${size} created`);
}

// Main execution
async function main() {
  console.log('Starting image generation...\n');

  try {
    // Generate social media images
    generateOGImage();
    generateTwitterImage();

    // Generate PWA icons
    const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
    iconSizes.forEach(size => generatePWAIcon(size));

    console.log('\n✅ All images generated successfully!');
    console.log('\nGenerated files:');
    console.log('- public/images/og-image.jpg (1200x630)');
    console.log('- public/images/twitter-image.jpg (1200x675)');
    iconSizes.forEach(size => {
      console.log(`- public/icons/icon-${size}x${size}.png`);
    });

  } catch (error) {
    console.error('❌ Error generating images:', error);
    process.exit(1);
  }
}

main();
