# App Icon and Splash Screen Setup

## 📱 Asset Requirements

The WildPraxis logo images provided need to be placed in the `FieldQuest/assets/` folder with the following specifications:

### Icon Files

1. **`icon.png`** - Main app icon
   - Size: 1024x1024 pixels
   - Format: PNG with transparency
   - Use: iOS and Android app icon

2. **`adaptive-icon.png`** - Android adaptive icon
   - Size: 1024x1024 pixels
   - Format: PNG with transparency
   - Use: Android adaptive icon foreground
   - Background color: `#1a1a1a` (dark green/black from logo)

3. **`splash.png`** - Splash screen
   - Size: 2048x2048 pixels (or larger)
   - Format: PNG with transparency
   - Use: Loading screen on app startup
   - Background color: `#1a1a1a`

4. **`notification-icon.png`** - Notification icon
   - Size: 96x96 pixels
   - Format: PNG with transparency
   - Use: Push notification icon
   - Color tint: `#D97706` (amber/orange from logo)

5. **`favicon.png`** - Web favicon (if running as PWA)
   - Size: 48x48 pixels
   - Format: PNG
   - Use: Browser tab icon

## 🎨 Image Processing Instructions

### From the Provided WildPraxis Logo:

The logo features:
- Pennsylvania state outline
- Mountain silhouette with sunset/sunrise
- Forest treeline
- Mayfly insect
- Golden/amber text on dark green background

### Creating the Required Assets:

1. **For `icon.png` (1024x1024)**:
   - Use the full logo image
   - Ensure all elements are visible within safe area (inner 960x960)
   - Keep the dark background (#1a1a1a or similar)

2. **For `adaptive-icon.png` (1024x1024)**:
   - Same as icon.png
   - Android will crop/mask this automatically
   - Keep important elements in center 66% (684x684)

3. **For `splash.png` (2048x2048 or larger)**:
   - Center the logo
   - Scale to fit nicely (logo should be ~60-70% of screen width)
   - Dark background matching the logo

4. **For `notification-icon.png` (96x96)**:
   - Simplified version - just the mayfly silhouette or PA outline
   - Single color (white or transparent) on transparent background
   - Android will apply the amber tint (#D97706)

## 📂 File Placement

Place all processed images in:
```
FieldQuest/
└── assets/
    ├── icon.png
    ├── adaptive-icon.png
    ├── splash.png
    ├── notification-icon.png
    └── favicon.png
```

## 🛠️ Quick Image Preparation

If you have the logo images provided, you can use:

### Online Tools:
- **App Icon Generator**: https://www.appicon.co/
- **Adaptive Icon Generator**: https://romannurik.github.io/AndroidAssetStudio/
- **Splash Screen Generator**: https://www.pixelmator.com/ or Figma

### Command Line (ImageMagick):
```bash
# Resize for icon
convert wildpraxis-logo.png -resize 1024x1024 -background "#1a1a1a" -gravity center -extent 1024x1024 icon.png

# Resize for splash
convert wildpraxis-logo.png -resize 1536x1536 -background "#1a1a1a" -gravity center -extent 2048x2048 splash.png

# Create notification icon (simplified)
convert wildpraxis-logo.png -resize 96x96 -colorspace Gray -threshold 50% notification-icon.png
```

## ✅ Current Configuration

The `app.json` is already configured to use these assets:

```json
{
  "icon": "./assets/icon.png",
  "splash": {
    "image": "./assets/splash.png",
    "backgroundColor": "#1a1a1a"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#1a1a1a"
    }
  },
  "notification": {
    "icon": "./assets/notification-icon.png",
    "color": "#D97706"
  }
}
```

## 🎨 Color Palette from Logo

For consistency across the app:

- **Dark Background**: `#1a1a1a` or `#1F2937`
- **Forest Green**: `#2E7D32` or `#1E4620`
- **Amber/Gold**: `#D97706`, `#F59E0B`, `#FBBF24`
- **Sunset Orange**: `#EA580C`, `#FB923C`

## 📱 Testing Assets

After placing the assets:

1. **Clear Expo cache**:
   ```bash
   expo start -c
   ```

2. **Build for device**:
   ```bash
   eas build --profile development --platform ios
   eas build --profile development --platform android
   ```

3. **Check on device**: Ensure icon and splash screen display correctly

## 🔧 Troubleshooting

**Icon not showing?**
- Clear cache: `expo start -c`
- Rebuild: `expo prebuild --clean`

**Splash screen issues?**
- Check image dimensions (must be >= 2048x2048)
- Verify backgroundColor matches logo

**Notification icon not visible?**
- Must be 96x96 pixels
- Must have transparent background
- Android requires simple silhouette

## 📝 Notes

- Assets are NOT included in git by default (add them separately if needed)
- For production builds, use high-quality PNG files
- Test on both light and dark mode devices
- Verify icons at multiple sizes (iOS requires various sizes)

## 🚀 Next Steps

1. Create/process the 5 required image files from the WildPraxis logo
2. Place them in `FieldQuest/assets/`
3. Test with `expo start`
4. Build for devices with `eas build`

The WildPraxis branding will then be complete! 🦌🌲

