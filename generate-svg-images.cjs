#!/usr/bin/env node

/**
 * Generate SVG images for iOS web app
 * This script creates SVG files for icons and splash screens
 */

const fs = require('fs');
const path = require('path');

// SVG template for icons
function createIconSVG(width, height, text, color = '#6C63FF') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${color}"/>
  <text x="${width/2}" y="${height/2 + 20}" font-family="Arial, sans-serif" font-size="${width/4}" font-weight="bold" fill="white" text-anchor="middle">${text}</text>
</svg>`;
}

// SVG template for splash screens
function createSplashSVG(width, height, text, color = '#000000') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${color}"/>
  <text x="${width/2}" y="${height/2}" font-family="Arial, sans-serif" font-size="${width/12}" font-weight="bold" fill="white" text-anchor="middle">${text}</text>
</svg>`;
}

// Image configurations
const icons = [
  { name: 'icon-180x180.svg', width: 180, height: 180, text: 'TM' },
  { name: 'icon-167x167.svg', width: 167, height: 167, text: 'TM' },
  { name: 'icon-152x152.svg', width: 152, height: 152, text: 'TM' },
  { name: 'icon-120x120.svg', width: 120, height: 120, text: 'TM' },
  { name: 'icon-192x192.svg', width: 192, height: 192, text: 'TM' },
  { name: 'icon-512x512.svg', width: 512, height: 512, text: 'TM' }
];

const splashScreens = [
  { name: 'iphone-x-splash.svg', width: 1125, height: 2436, text: 'Ticketmaster' },
  { name: 'iphone-plus-splash.svg', width: 1242, height: 2208, text: 'Ticketmaster' },
  { name: 'iphone-8-splash.svg', width: 750, height: 1334, text: 'Ticketmaster' },
  { name: 'ipad-pro-splash.svg', width: 2048, height: 2732, text: 'Ticketmaster' },
  { name: 'ipad-pro-10-splash.svg', width: 1668, height: 2388, text: 'Ticketmaster' },
  { name: 'ipad-mini-splash.svg', width: 1536, height: 2048, text: 'Ticketmaster' }
];

function createSVGFile(config, outputPath, templateFunction) {
  const svg = templateFunction(config.width, config.height, config.text);
  fs.writeFileSync(outputPath, svg);
  console.log(`✅ Created: ${outputPath}`);
}

function generateSVGImages() {
  const publicDir = path.join(__dirname, 'public');
  const iconsDir = path.join(publicDir, 'icons');
  const splashDir = path.join(publicDir, 'splash');

  // Create directories if they don't exist
  [iconsDir, splashDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  console.log('🎨 Generating SVG images for iOS web app...\n');

  // Generate icons
  console.log('📱 Creating icons:');
  icons.forEach(icon => {
    const outputPath = path.join(iconsDir, icon.name);
    createSVGFile(icon, outputPath, createIconSVG);
  });

  // Generate splash screens
  console.log('\n🖼️  Creating splash screens:');
  splashScreens.forEach(splash => {
    const outputPath = path.join(splashDir, splash.name);
    createSVGFile(splash, outputPath, createSplashSVG);
  });

  console.log('\n✨ All SVG images generated successfully!');
  console.log('📝 Note: These are placeholder SVG images. They work directly in modern browsers.');
  console.log('🔄 To convert to PNG, use online tools or design software like Figma/Photoshop.');
  console.log('🌐 Recommended online converters:');
  console.log('   - https://cloudconvert.com/svg-to-png');
  console.log('   - https://convertio.co/svg-png/');
  console.log('   - https://www.aconvert.com/image/svg-to-png/');
}

// Run the generator
generateSVGImages();