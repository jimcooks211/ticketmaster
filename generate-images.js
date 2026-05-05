#!/usr/bin/env node

/**
 * Generate placeholder images for iOS web app
 * This script creates basic colored placeholder images with text
 * Requires: canvas npm package (npm install canvas)
 */

const fs = require('fs');
const path = require('path');

// Check if canvas is available
let canvas;
try {
  canvas = require('canvas');
} catch (error) {
  console.error('Canvas package not found. Install it with: npm install canvas');
  process.exit(1);
}

const { createCanvas, loadImage } = canvas;

// Image configurations
const icons = [
  { name: 'icon-180x180.png', width: 180, height: 180, color: '#6C63FF', text: 'TM' },
  { name: 'icon-167x167.png', width: 167, height: 167, color: '#6C63FF', text: 'TM' },
  { name: 'icon-152x152.png', width: 152, height: 152, color: '#6C63FF', text: 'TM' },
  { name: 'icon-120x120.png', width: 120, height: 120, color: '#6C63FF', text: 'TM' },
  { name: 'icon-192x192.png', width: 192, height: 192, color: '#6C63FF', text: 'TM' },
  { name: 'icon-512x512.png', width: 512, height: 512, color: '#6C63FF', text: 'TM' }
];

const splashScreens = [
  { name: 'iphone-x-splash.png', width: 1125, height: 2436, color: '#000000', text: 'Ticketmaster' },
  { name: 'iphone-plus-splash.png', width: 1242, height: 2208, color: '#000000', text: 'Ticketmaster' },
  { name: 'iphone-8-splash.png', width: 750, height: 1334, color: '#000000', text: 'Ticketmaster' },
  { name: 'ipad-pro-splash.png', width: 2048, height: 2732, color: '#000000', text: 'Ticketmaster' },
  { name: 'ipad-pro-10-splash.png', width: 1668, height: 2388, color: '#000000', text: 'Ticketmaster' },
  { name: 'ipad-mini-splash.png', width: 1536, height: 2048, color: '#000000', text: 'Ticketmaster' }
];

function createImage(config, outputPath) {
  const { width, height, color, text } = config;

  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // Add text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${Math.floor(width / 10)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Center text
  ctx.fillText(text, width / 2, height / 2);

  // Save image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);

  console.log(`✅ Created: ${outputPath}`);
}

function generateImages() {
  const publicDir = path.join(__dirname, 'public');
  const iconsDir = path.join(publicDir, 'icons');
  const splashDir = path.join(publicDir, 'splash');

  // Create directories if they don't exist
  [iconsDir, splashDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  console.log('🎨 Generating iOS web app images...\n');

  // Generate icons
  console.log('📱 Creating icons:');
  icons.forEach(icon => {
    const outputPath = path.join(iconsDir, icon.name);
    createImage(icon, outputPath);
  });

  // Generate splash screens
  console.log('\n🖼️  Creating splash screens:');
  splashScreens.forEach(splash => {
    const outputPath = path.join(splashDir, splash.name);
    createImage(splash, outputPath);
  });

  console.log('\n✨ All images generated successfully!');
  console.log('📝 Note: These are placeholder images. Replace them with your actual designs.');
}

// Run the generator
generateImages();