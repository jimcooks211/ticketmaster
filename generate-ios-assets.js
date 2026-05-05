#!/usr/bin/env node

/**
 * Generate iOS splash screens from source image
 * Uses sharp for high-quality image processing
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// iOS splash screen configurations
// Format: { name, width, height, description }
const splashScreens = [
  // iPhone 14 Pro Max (2022)
  { name: 'iphone-14-pro-max-splash.png', width: 1320, height: 2868, description: 'iPhone 14 Pro Max' },
  // iPhone 14 Pro (2022)
  { name: 'iphone-14-pro-splash.png', width: 1179, height: 2556, description: 'iPhone 14 Pro' },
  // iPhone 14/13/12 Pro Max
  { name: 'iphone-14-pro-max-legacy-splash.png', width: 1284, height: 2778, description: 'iPhone 12/13/14 Pro Max' },
  // iPhone 14/13/12 Pro
  { name: 'iphone-14-pro-legacy-splash.png', width: 1170, height: 2532, description: 'iPhone 12/13/14 Pro' },
  // iPhone 14/13/12 mini
  { name: 'iphone-14-mini-splash.png', width: 1080, height: 2340, description: 'iPhone 12/13/14 mini' },
  // iPhone 14/13/12 (base)
  { name: 'iphone-14-splash.png', width: 828, height: 1792, description: 'iPhone 12/13/14' },
  // iPhone 11 Pro Max / XS Max
  { name: 'iphone-11-pro-max-splash.png', width: 1242, height: 2688, description: 'iPhone 11 Pro Max / XS Max' },
  // iPhone 11 Pro / X / XS
  { name: 'iphone-x-splash.png', width: 1125, height: 2436, description: 'iPhone X / XS / 11 Pro' },
  // iPhone 11 / XR
  { name: 'iphone-11-splash.png', width: 828, height: 1792, description: 'iPhone 11 / XR' },
  // iPhone 8 Plus / 7 Plus / 6s Plus
  { name: 'iphone-plus-splash.png', width: 1242, height: 2208, description: 'iPhone 8 Plus / 7 Plus / 6s Plus' },
  // iPhone 8 / 7 / 6s / 6 / SE (2nd/3rd gen)
  { name: 'iphone-8-splash.png', width: 750, height: 1334, description: 'iPhone 8 / 7 / 6s / 6 / SE' },
  // iPhone SE (1st gen)
  { name: 'iphone-se-splash.png', width: 640, height: 1136, description: 'iPhone SE (1st gen)' },
  // iPad Pro 12.9" (6th gen)
  { name: 'ipad-pro-129-splash.png', width: 2048, height: 2732, description: 'iPad Pro 12.9"' },
  // iPad Pro 11"
  { name: 'ipad-pro-11-splash.png', width: 1668, height: 2388, description: 'iPad Pro 11"' },
  // iPad Mini / Air
  { name: 'ipad-mini-splash.png', width: 1536, height: 2048, description: 'iPad Mini / Air' },
];

// Home screen icon configurations
const icons = [
  { name: 'icon-180x180.png', width: 180, height: 180, description: 'iPhone (3x)' },
  { name: 'icon-167x167.png', width: 167, height: 167, description: 'iPad Pro (2x)' },
  { name: 'icon-152x152.png', width: 152, height: 152, description: 'iPad (2x)' },
  { name: 'icon-120x120.png', width: 120, height: 120, description: 'iPhone (2x)' },
  { name: 'icon-76x76.png', width: 76, height: 76, description: 'iPad (1x)' },
  { name: 'icon-60x60.png', width: 60, height: 60, description: 'iPhone (1x)' },
  { name: 'icon-40x40.png', width: 40, height: 40, description: 'Notification (2x)' },
  { name: 'icon-20x20.png', width: 20, height: 20, description: 'Notification (1x)' },
];

async function generateSplashScreens(sourcePath, outputDir) {
  console.log('🎨 Generating iOS splash screens...\n');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Check if source image exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source image not found: ${sourcePath}`);
    console.log('💡 Please place your splash screen image at: public/splash/homesplash.jpeg');
    return;
  }

  try {
    // Get source image metadata
    const metadata = await sharp(sourcePath).metadata();
    console.log(`📐 Source image: ${metadata.width}x${metadata.height} (${metadata.format})\n`);

    // Generate splash screens
    console.log('📱 Creating splash screens:');
    for (const config of splashScreens) {
      const outputPath = path.join(outputDir, config.name);

      await sharp(sourcePath)
        .resize(config.width, config.height, {
          fit: 'cover',
          position: 'center',
        })
        .modulate({
          brightness: 1.3, // Brighten the image
          saturation: 1.1
        })
        .png({ quality: 90 })
        .toFile(outputPath);

      console.log(`  ✅ ${config.description} (${config.width}x${config.height}) → ${config.name}`);
    }

    console.log('\n✨ All splash screens generated successfully!');
  } catch (error) {
    console.error('❌ Error generating splash screens:', error.message);
  }
}

async function generateIcons(sourcePath, outputDir) {
  console.log('\n🎨 Generating iOS home screen icons...\n');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Check if source image exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source icon not found: ${sourcePath}`);
    console.log('💡 Please place your icon at: public/icons/homeicon.webp');
    return;
  }

  try {
    // Get source image metadata
    const metadata = await sharp(sourcePath).metadata();
    console.log(`📐 Source icon: ${metadata.width}x${metadata.height} (${metadata.format})\n`);

    // Generate icons
    console.log('📱 Creating icons:');
    for (const config of icons) {
      const outputPath = path.join(outputDir, config.name);

      await sharp(sourcePath)
        .resize(config.width, config.height, {
          fit: 'cover',
          position: 'center',
        })
        .png({ quality: 90 })
        .toFile(outputPath);

      console.log(`  ✅ ${config.description} (${config.width}x${config.height}) → ${config.name}`);
    }

    console.log('\n✨ All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
  }
}

async function main() {
  const projectDir = path.join(process.cwd());
  const publicDir = path.join(projectDir, 'public');
  const splashDir = path.join(publicDir, 'splash');
  const iconsDir = path.join(publicDir, 'icons');

  const splashSource = path.join(splashDir, 'homesplash.jpeg');
  const iconSource = path.join(iconsDir, 'homeicon.webp');

  // Generate splash screens
  await generateSplashScreens(splashSource, splashDir);

  // Generate icons
  await generateIcons(iconSource, iconsDir);

  console.log('\n📝 Next steps:');
  console.log('1. Update index.html with the new splash screen links');
  console.log('2. Update manifest.json with the new icon sizes');
  console.log('3. Test on iOS devices');
}

// Run the generator
main().catch(console.error);
