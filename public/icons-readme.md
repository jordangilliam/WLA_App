# PWA Icons Required

For the PWA to work fully, you need to add these icon files to the `/public` directory:

## Required Icons:

1. **icon-192.png** (192x192px)
   - App icon for Android home screen
   - Should feature WLA logo or Pennsylvania wildlife

2. **icon-512.png** (512x512px)
   - High-resolution app icon
   - Used for splash screens and app stores

3. **screenshot-1.png** (1280x720px)
   - Wide screenshot showing app features
   - For PWA installation preview

## Icon Design Guidelines:

### Colors:
- Primary: #0077B6 (WLA Blue)
- Secondary: #023047 (Dark Blue)
- Accent: #FFD60A (Gold/Yellow)

### Content Suggestions:
- WLA logo with Pennsylvania outline
- Wildlife silhouettes (deer, trout, turkey, bear)
- Tree/conservation imagery
- "WLA" text in readable font

### Format:
- PNG with transparency
- Square aspect ratio
- Padding: 10% safe zone
- Style: Flat, modern, recognizable at small sizes

## How to Create Icons:

### Option 1: Use a Design Tool
- Canva, Figma, Adobe Illustrator
- Export as PNG at specified sizes

### Option 2: PWA Builder
- https://www.pwabuilder.com/imageGenerator
- Upload base image, generates all sizes

### Option 3: Online Tool
- https://realfavicongenerator.net/
- Comprehensive icon generator

## Temporary Solution:

While creating custom icons, you can use placeholder icons:
- Copy any 192x192 and 512x512 PNG
- Rename to icon-192.png and icon-512.png
- Place in /public directory

The app will work without these, but won't install as PWA until icons are present.

