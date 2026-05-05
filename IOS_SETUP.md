# iOS Web App Setup Guide

This project is configured as a proper iOS web app that can be added to the home screen from Safari or other iOS browsers.

## Required Images

### Home Screen Icons (Apple Touch Icons)
Create the following icon sizes and place them in the `public/icons/` directory:

- `icon-180x180.png` - iPhone (3x) - **180x180px**
- `icon-167x167.png` - iPad Pro (2x) - **167x167px**
- `icon-152x152.png` - iPad (2x) - **152x152px**
- `icon-120x120.png` - iPhone (2x) - **120x120px**
- `icon-192x192.png` - Android/Modern - **192x192px**
- `icon-512x512.png` - Android/Modern - **512x512px**

### Splash Screens (Startup Images)
Create the following splash screen sizes and place them in the `public/splash/` directory:

- `iphone-x-splash.png` - iPhone X/XS/11 Pro - **1125x2436px**
- `iphone-plus-splash.png` - iPhone 6/7/8 Plus - **1242x2208px**
- `iphone-8-splash.png` - iPhone 6/7/8 - **750x1334px**
- `ipad-pro-splash.png` - iPad Pro 12.9" - **2048x2732px**
- `ipad-pro-10-splash.png` - iPad Pro 10.5" - **1668x2388px**
- `ipad-mini-splash.png` - iPad Mini/Air - **1536x2048px**

## Image Creation Tools

### Using Online Tools
1. **AppIconGenerator**: https://appicon.co/
2. **MakeAppIcon**: https://makeappicon.com/
3. **IconKitchen**: https://icon.kitchen/

### Using Command Line (ImageMagick)
If you have ImageMagick installed:

```bash
# Create icons from a source image
convert source.png -resize 180x180 icon-180x180.png
convert source.png -resize 167x167 icon-167x167.png
convert source.png -resize 152x152 icon-152x152.png
convert source.png -resize 120x120 icon-120x120.png
convert source.png -resize 192x192 icon-192x192.png
convert source.png -resize 512x512 icon-512x512.png

# Create splash screens from a source image
convert source.png -resize 1125x2436 iphone-x-splash.png
convert source.png -resize 1242x2208 iphone-plus-splash.png
convert source.png -resize 750x1334 iphone-8-splash.png
convert source.png -resize 2048x2732 ipad-pro-splash.png
convert source.png -resize 1668x2388 ipad-pro-10-splash.png
convert source.png -resize 1536x2048 ipad-mini-splash.png
```

### Using Design Tools
- **Figma**: Export at multiple sizes
- **Photoshop**: Save for Web with different dimensions
- **Sketch**: Export at multiple resolutions

## Design Guidelines

### Icons
- **Format**: PNG with transparency
- **Style**: Simple, recognizable at small sizes
- **Content**: App logo or initials
- **Background**: Transparent or solid color
- **Corner Radius**: iOS will automatically round corners

### Splash Screens
- **Format**: PNG or JPEG
- **Content**: App logo centered, optional background
- **Safe Area**: Keep important content away from edges
- **Status Bar Space**: Leave space at top for status bar
- **Home Indicator Space**: Leave space at bottom for home indicator

## Testing

### On iOS Device
1. Open your app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Verify the icon and splash screen appear correctly

### Using iOS Simulator
1. Open Safari in iOS Simulator
2. Navigate to your app
3. Add to Home Screen
4. Test the launch experience

### Using Browser DevTools
```javascript
// Check if service worker is registered
navigator.serviceWorker.getRegistrations().then(console.log);

// Check manifest
fetch('/manifest.json').then(r => r.json()).then(console.log);
```

## Current Status

✅ HTML configured with proper iOS meta tags
✅ Web app manifest created
✅ Service worker registered for offline capability
❌ **Images need to be created** (see requirements above)

## Next Steps

1. Create all required icon images
2. Create all required splash screen images
3. Test on actual iOS devices
4. Adjust designs based on testing results

## Additional Resources

- [Apple Human Interface Guidelines - App Icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Web App Manifest - MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Progressive Web Apps - iOS](https://webkit.org/blog/8040/)