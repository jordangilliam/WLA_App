# WLA App Design System

## Brand Identity

### Primary Logos
- **WLA (Wildlife Leadership Academy)**: Fish (blue), Bird (orange), Deer (tan/olive)
- **String Theory Solutions**: Pittsburgh skyline in gold on black - Developer brand
- **WildPraxis**: Pennsylvania outdoor adventure with forest and mayfly

## Color Palette

### Primary Colors
```css
--wla-blue: #0891B2;        /* Vibrant cyan from fish */
--wla-orange: #EA580C;      /* Warm orange from bird */
--wla-olive: #84A98C;       /* Olive/sage from deer */
--wla-forest: #2F4F4F;      /* Deep forest green */
```

### Accent Colors
```css
--string-gold: #D4AF37;     /* Brass/gold from String Theory */
--string-black: #1A1A1A;    /* Sophisticated black */
--wild-sunset: #F59E0B;     /* Sunset orange from WildPraxis */
--wild-earth: #92400E;      /* Earth brown */
```

### Neutral Colors
```css
--neutral-50: #FAFAFA;
--neutral-100: #F5F5F5;
--neutral-200: #E5E5E5;
--neutral-300: #D4D4D4;
--neutral-700: #404040;
--neutral-800: #262626;
--neutral-900: #171717;
```

### Semantic Colors
```css
--success: #10B981;         /* Green for achievements */
--warning: #F59E0B;         /* Orange for alerts */
--error: #EF4444;           /* Red for errors */
--info: #3B82F6;            /* Blue for info */
```

## Typography

### Font Families
- **Primary**: 'Inter', system-ui, sans-serif
- **Display**: 'Poppins', sans-serif (for headers)
- **Mono**: 'JetBrains Mono', monospace (for data)

### Font Scales
- **xs**: 0.75rem / 12px
- **sm**: 0.875rem / 14px
- **base**: 1rem / 16px
- **lg**: 1.125rem / 18px
- **xl**: 1.25rem / 20px
- **2xl**: 1.5rem / 24px
- **3xl**: 1.875rem / 30px
- **4xl**: 2.25rem / 36px

## Interactive Elements

### Buttons
1. **Primary Button** (WLA Blue)
   - Background: wla-blue
   - Hover: Darken 10%
   - Active: Scale 0.95
   - Shadow: Elevated on hover

2. **Secondary Button** (WLA Orange)
   - Background: wla-orange
   - Hover: Darken 10%
   - Active: Scale 0.95

3. **Accent Button** (String Theory Gold)
   - Background: string-gold
   - Text: string-black
   - Hover: Lighten 10%

### Cards
- Background: White
- Border: 1px solid neutral-200
- Radius: 12px (soft, approachable)
- Shadow: Subtle elevation
- Hover: Lift effect with increased shadow

### Navigation
- Background: string-black with slight transparency
- Active tab: wla-blue underline
- Icons: string-gold on hover

## Animation Principles

### Timing
- **Fast**: 150ms (micro-interactions)
- **Standard**: 250ms (button clicks, hovers)
- **Slow**: 400ms (page transitions)

### Easing
- **Default**: cubic-bezier(0.4, 0, 0.2, 1)
- **In**: cubic-bezier(0.4, 0, 1, 1)
- **Out**: cubic-bezier(0, 0, 0.2, 1)
- **Bounce**: cubic-bezier(0.68, -0.55, 0.265, 1.55)

### Effects
1. **Button Press**: Scale down to 0.95
2. **Card Hover**: Translate Y -4px + shadow increase
3. **Success Feedback**: Scale pulse (1 → 1.1 → 1)
4. **Loading**: Smooth spinner with wla-blue
5. **Page Enter**: Fade in + slide up 20px

## Component Patterns

### Achievement Badge
- Circular or shield shape
- Gradient: wla-blue to wla-olive
- Glow effect on unlock
- Bounce animation on earn

### Progress Bar
- Height: 12px
- Radius: 6px (pill shape)
- Gradient: wla-blue to wild-sunset
- Animated fill on change

### Location Marker
- Icon: Wildlife animal or fish
- Color: wla-orange with white border
- Pulse animation on active
- Shadow for elevation

### Species Card
- Image with overlay gradient
- Title in white over dark gradient
- Quick-action buttons with icons
- Flip animation to show details

## Layout Principles

### Spacing Scale
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

### Grid
- Mobile: Single column, 16px padding
- Tablet: 2 columns, 24px gap
- Desktop: 3-4 columns, 32px gap

### Max Widths
- **Container**: 1280px
- **Reading**: 65ch
- **Form**: 480px

## Interactive Feel (Koala Sampler / BandLab Inspired)

### Touch Targets
- Minimum: 44x44px
- Preferred: 48x48px
- Icon buttons: 40x40px with 8px padding

### Feedback
- Haptic feel through scale animations
- Color shifts on press
- Sound-inspired visual feedback
- Immediate response (no lag)

### Gamification
- Progress bars everywhere
- Achievement badges
- Streak counters with fire emoji
- Level-up animations
- Collectible species cards

### Data Visualization
- Clean, colorful charts
- Animated transitions
- Interactive tooltips
- Touch-friendly legends

