#!/usr/bin/env node

/**
 * Generate splash screens with padding around the image
 * Background color: #141414 (dark gray)
 * Slightly larger content area (increased by ~15%)
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Background color
const BG_COLOR = { r: 20, g: 20, b: 20, alpha: 1 }; // #141414

// Comprehensive splash screen configurations with padding (content area increased by ~15%)
const splashScreens = [
  // iPhone 17 Pro Max / 16 Pro Max (2024+)
  { name: 'iphone-17-pro-max-splash.png', width: 1320, height: 2868, contentWidth: 1050, contentHeight: 2268, description: 'iPhone 17/16 Pro Max' },
  // iPhone 17 Pro / 16 Pro (2024+)
  { name: 'iphone-17-pro-splash.png', width: 1179, height: 2556, contentWidth: 920, contentHeight: 2028, description: 'iPhone 17/16 Pro' },
  // iPhone 17 / 16 / 15 Pro Max (2023+)
  { name: 'iphone-15-pro-max-splash.png', width: 1290, height: 2796, contentWidth: 1020, height: 2224, description: 'iPhone 17/16/15 Pro Max' },
  // iPhone 17 / 16 / 15 Pro (2023+)
  { name: 'iphone-15-pro-splash.png', width: 1179, height: 2556, contentWidth: 920, contentHeight: 2028, description: 'iPhone 17/16/15 Pro' },
  // iPhone 17 / 16 / 15 Plus (2023+)
  { name: 'iphone-15-plus-splash.png', width: 1284, height: 2778, contentWidth: 1000, height: 2208, description: 'iPhone 17/16/15 Plus' },
  // iPhone 17 / 16 / 15 mini (2023+)
  { name: 'iphone-15-mini-splash.png', width: 1080, height: 2340, contentWidth: 850, contentHeight: 1850, description: 'iPhone 17/16/15 mini' },
  // iPhone 17 / 16 / 15 (base) (2023+)
  { name: 'iphone-15-splash.png', width: 828, height: 1792, contentWidth: 650, contentHeight: 1400, description: 'iPhone 17/16/15' },
  // iPhone 14 Pro Max (2022)
  { name: 'iphone-14-pro-max-splash.png', width: 1320, height: 2868, contentWidth: 1050, contentHeight: 2268, description: 'iPhone 14 Pro Max' },
  // iPhone 14 Pro (2022)
  { name: 'iphone-14-pro-splash.png', width: 1179, height: 2556, contentWidth: 920, contentHeight: 2028, description: 'iPhone 14 Pro' },
  // iPhone 14/13/12 Pro Max
  { name: 'iphone-14-pro-max-legacy-splash.png', width: 1284, height: 2778, contentWidth: 1000, contentHeight: 2208, description: 'iPhone 14/13/12 Pro Max' },
  // iPhone 14/13/12 Pro
  { name: 'iphone-14-pro-legacy-splash.png', width: 1170, height: 2532, contentWidth: 920, contentHeight: 2028, description: 'iPhone 14/13/12 Pro' },
  // iPhone 14/13/12 mini
  { name: 'iphone-14-mini-splash.png', width: 1080, height: 2340, contentWidth: 850, contentHeight: 1850, description: 'iPhone 14/13/12 mini' },
  // iPhone 14/13/12 (base)
  { name: 'iphone-14-splash.png', width: 828, height: 1792, contentWidth: 650, contentHeight: 1400, description: 'iPhone 14/13/12' },
  // iPhone 11 Pro Max / XS Max
  { name: 'iphone-11-pro-max-splash.png', width: 1242, height: 2688, contentWidth: 980, contentHeight: 2112, description: 'iPhone 11 Pro Max / XS Max' },
  // iPhone 11 Pro / X / XS
  { name: 'iphone-x-splash.png', width: 1125, height: 2436, contentWidth: 880, contentHeight: 1904, description: 'iPhone X / XS / 11 Pro' },
  // iPhone 11 / XR
  { name: 'iphone-11-splash.png', width: 828, height: 1792, contentWidth: 650, contentHeight: 1400, description: 'iPhone 11 / XR' },
  // iPhone 8 Plus / 7 Plus / 6s Plus
  { name: 'iphone-plus-splash.png', width: 1242, height: 2208, contentWidth: 980, contentHeight: 1736, description: 'iPhone 8 Plus / 7 Plus / 6s Plus' },
  // iPhone 8 / 7 / 6s / 6 / SE (2nd/3rd gen)
  { name: 'iphone-8-splash.png', width: 750, height: 1334, contentWidth: 580, contentHeight: 1032, description: 'iPhone 8 / 7 / 6s / 6 / SE' },
  // iPhone SE (1st gen)
  { name: 'iphone-se-splash.png', width: 640, height: 1136, contentWidth: 500, contentHeight: 880, description: 'iPhone SE (1st gen)' },
  // iPad Pro 12.9" (6th gen)
  { name: 'ipad-pro-129-splash.png', width: 2048, height: 2732, contentWidth: 1620, contentHeight: 2160, description: 'iPad Pro 12.9"' },
  // iPad Pro 11"
  { name: 'ipad-pro-11-splash.png', width: 1668, height: 2388, contentWidth: 1320, contentHeight: 1888, description: 'iPad Pro 11"' },
  // iPad Mini / Air
  { name: 'ipad-mini-splash.png', width: 1536, height: 2048, contentWidth: 1220, contentHeight: 1624, description: 'iPad Mini / Air' },
];

async function generateSplashScreensWithPadding(sourcePath, outputDir) {
  console.log('🎨 Generating splash screens with padding (#141414 background, slightly larger content)...\n');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source image not found: ${sourcePath}`);
    return;
  }

  try {
    const metadata = await sharp(sourcePath).metadata();
    console.log(`📐 Source image: ${metadata.width}x${metadata.height}\n`);

    console.log('📱 Creating splash screens with padding:');
    for (const config of splashScreens) {
      const outputPath = path.join(outputDir, config.name);

      // Calculate padding
      const paddingX = Math.floor((config.width - config.contentWidth) / 2);
      const paddingY = Math.floor((config.height - config.contentHeight) / 2);

      // Create a canvas with the target size and #141414 background
      const canvas = sharp({
        create: {
          width: config.width,
          height: config.height,
          channels: 4,
          background: BG_COLOR
        }
      });

      // Resize the source image to fit within the content area
      const resizedImage = await sharp(sourcePath)
        .resize(config.contentWidth, config.contentHeight, {
          fit: 'cover',
          position: 'center'
        })
        .png({ quality: 90 })
        .toBuffer();

      // Composite the resized image onto the canvas
      await canvas
        .composite([
          {
            input: resizedImage,
            left: paddingX,
            top: paddingY
          }
        ])
        .png({ quality: 90 })
        .toFile(outputPath);

      console.log(`  ✅ ${config.description} (${config.width}x${config.height}, content: ${config.contentWidth}x${config.contentHeight}, padding: ${paddingX}px horizontal, ${paddingY}px vertical)`);
    }

    console.log('\n✨ All splash screens with padding generated successfully!');
    console.log(`\n📊 Total: ${splashScreens.length} splash screens created`);
    console.log('📱 Coverage: iPhone 6 through iPhone 17 Pro Max');
    console.log('🎨 Background color: #141414');
    console.log('📏 Content size: ~15% larger than previous');
  } catch (error) {
    console.error('❌ Error generating splash screens:', error.message);
  }
}

async function main() {
  const projectDir = path.join(process.cwd());
  const publicDir = path.join(projectDir, 'public');
  const splashDir = path.join(publicDir, 'splash');
  const splashSource = path.join(splashDir, 'homesplash.jpeg');

  await generateSplashScreensWithPadding(splashSource, splashDir);

  console.log('\n📝 Next steps:');
  console.log('1. Restart your dev server: npm run dev');
  console.log('2. Test on iOS devices');
  console.log('3. Add to home screen and launch to see splash screens');
}

main().catch(console.error);
