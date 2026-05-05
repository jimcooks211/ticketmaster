#!/usr/bin/env node

/**
 * Generate comprehensive splash screens for iPhone 6 through iPhone 17 Pro Max
 * Uses sharp for high-quality image processing
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Comprehensive splash screen configurations for all iPhone models
const splashScreens = [
  // iPhone 17 Pro Max / 16 Pro Max (2024+)
  { name: 'iphone-17-pro-max-splash.png', width: 1320, height: 2868, description: 'iPhone 17/16 Pro Max', deviceWidth: 440, deviceHeight: 956, pixelRatio: 3 },
  // iPhone 17 Pro / 16 Pro (2024+)
  { name: 'iphone-17-pro-splash.png', width: 1179, height: 2556, description: 'iPhone 17/16 Pro', deviceWidth: 393, deviceHeight: 852, pixelRatio: 3 },
  // iPhone 17 / 16 / 15 Pro Max (2023+)
  { name: 'iphone-15-pro-max-splash.png', width: 1290, height: 2796, description: 'iPhone 17/16/15 Pro Max', deviceWidth: 430, deviceHeight: 932, pixelRatio: 3 },
  // iPhone 17 / 16 / 15 Pro (2023+)
  { name: 'iphone-15-pro-splash.png', width: 1179, height: 2556, description: 'iPhone 17/16/15 Pro', deviceWidth: 393, deviceHeight: 852, pixelRatio: 3 },
  // iPhone 17 / 16 / 15 Plus (2023+)
  { name: 'iphone-15-plus-splash.png', width: 1284, height: 2778, description: 'iPhone 17/16/15 Plus', deviceWidth: 428, deviceHeight: 926, pixelRatio: 3 },
  // iPhone 17 / 16 / 15 mini (2023+)
  { name: 'iphone-15-mini-splash.png', width: 1080, height: 2340, description: 'iPhone 17/16/15 mini', deviceWidth: 360, deviceHeight: 780, pixelRatio: 3 },
  // iPhone 17 / 16 / 15 (base) (2023+)
  { name: 'iphone-15-splash.png', width: 828, height: 1792, description: 'iPhone 17/16/15', deviceWidth: 414, deviceHeight: 896, pixelRatio: 2 },
  // iPhone 14 Pro Max (2022)
  { name: 'iphone-14-pro-max-splash.png', width: 1320, height: 2868, description: 'iPhone 14 Pro Max', deviceWidth: 440, deviceHeight: 956, pixelRatio: 3 },
  // iPhone 14 Pro (2022)
  { name: 'iphone-14-pro-splash.png', width: 1179, height: 2556, description: 'iPhone 14 Pro', deviceWidth: 393, deviceHeight: 852, pixelRatio: 3 },
  // iPhone 14/13/12 Pro Max
  { name: 'iphone-14-pro-max-legacy-splash.png', width: 1284, height: 2778, description: 'iPhone 14/13/12 Pro Max', deviceWidth: 428, deviceHeight: 926, pixelRatio: 3 },
  // iPhone 14/13/12 Pro
  { name: 'iphone-14-pro-legacy-splash.png', width: 1170, height: 2532, description: 'iPhone 14/13/12 Pro', deviceWidth: 390, deviceHeight: 844, pixelRatio: 3 },
  // iPhone 14/13/12 mini
  { name: 'iphone-14-mini-splash.png', width: 1080, height: 2340, description: 'iPhone 14/13/12 mini', deviceWidth: 360, deviceHeight: 780, pixelRatio: 3 },
  // iPhone 14/13/12 (base)
  { name: 'iphone-14-splash.png', width: 828, height: 1792, description: 'iPhone 14/13/12', deviceWidth: 414, deviceHeight: 896, pixelRatio: 2 },
  // iPhone 11 Pro Max / XS Max
  { name: 'iphone-11-pro-max-splash.png', width: 1242, height: 2688, description: 'iPhone 11 Pro Max / XS Max', deviceWidth: 414, deviceHeight: 896, pixelRatio: 3 },
  // iPhone 11 Pro / X / XS
  { name: 'iphone-x-splash.png', width: 1125, height: 2436, description: 'iPhone X / XS / 11 Pro', deviceWidth: 375, deviceHeight: 812, pixelRatio: 3 },
  // iPhone 11 / XR
  { name: 'iphone-11-splash.png', width: 828, height: 1792, description: 'iPhone 11 / XR', deviceWidth: 414, deviceHeight: 896, pixelRatio: 2 },
  // iPhone 8 Plus / 7 Plus / 6s Plus
  { name: 'iphone-plus-splash.png', width: 1242, height: 2208, description: 'iPhone 8 Plus / 7 Plus / 6s Plus', deviceWidth: 414, deviceHeight: 736, pixelRatio: 3 },
  // iPhone 8 / 7 / 6s / 6 / SE (2nd/3rd gen)
  { name: 'iphone-8-splash.png', width: 750, height: 1334, description: 'iPhone 8 / 7 / 6s / 6 / SE', deviceWidth: 375, deviceHeight: 667, pixelRatio: 2 },
  // iPhone SE (1st gen)
  { name: 'iphone-se-splash.png', width: 640, height: 1136, description: 'iPhone SE (1st gen)', deviceWidth: 320, deviceHeight: 568, pixelRatio: 2 },
  // iPad Pro 12.9" (6th gen)
  { name: 'ipad-pro-129-splash.png', width: 2048, height: 2732, description: 'iPad Pro 12.9"', deviceWidth: 1024, deviceHeight: 1366, pixelRatio: 2 },
  // iPad Pro 11"
  { name: 'ipad-pro-11-splash.png', width: 1668, height: 2388, description: 'iPad Pro 11"', deviceWidth: 834, deviceHeight: 1194, pixelRatio: 2 },
  // iPad Mini / Air
  { name: 'ipad-mini-splash.png', width: 1536, height: 2048, description: 'iPad Mini / Air', deviceWidth: 768, deviceHeight: 1024, pixelRatio: 2 },
];

async function generateSplashScreens(sourcePath, outputDir) {
  console.log('🎨 Generating comprehensive splash screens...\n');

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
          brightness: 1.3,
          saturation: 1.1
        })
        .png({ quality: 90 })
        .toFile(outputPath);

      console.log(`  ✅ ${config.description} (${config.width}x${config.height}) → ${config.name}`);
    }

    console.log('\n✨ All splash screens generated successfully!');
    console.log(`\n📊 Total: ${splashScreens.length} splash screens created`);
    console.log('📱 Coverage: iPhone 6 through iPhone 17 Pro Max');
  } catch (error) {
    console.error('❌ Error generating splash screens:', error.message);
  }
}

async function main() {
  const projectDir = path.join(process.cwd());
  const publicDir = path.join(projectDir, 'public');
  const splashDir = path.join(publicDir, 'splash');
  const splashSource = path.join(splashDir, 'homesplash.jpeg');

  await generateSplashScreens(splashSource, splashDir);

  console.log('\n📝 Next steps:');
  console.log('1. Restart your dev server: npm run dev');
  console.log('2. Test on iOS devices (iPhone 6-17)');
  console.log('3. Add to home screen and launch to see splash screens');
}

// Run the generator
main().catch(console.error);
