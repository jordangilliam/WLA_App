# QR Code System Documentation

## Overview

The RAD Pass QR Code System provides secure, easy-to-use validation for reward redemptions. Students receive QR codes when claiming rewards, and partners scan these codes to validate and redeem.

---

## 📦 Components Created

### 1. **Utilities** (`lib/utils/qrcode.ts`)

Core functions for QR code generation and data handling:

```typescript
// Generate QR code as Data URL
const dataURL = await generateQRCodeDataURL(qrData, { width: 300 });

// Generate QR code on canvas
await generateQRCodeCanvas(canvas, qrData, { width: 300 });

// Encode/decode QR data
const encoded = encodeQRData(qrData);
const decoded = decodeQRData(qrString);

// Validate QR data
const { valid, errors } = validateQRData(qrData);

// Download QR code
await downloadQRCode(qrData, 'my-reward.png');
```

### 2. **Student Component** (`components/rewards/QRCodeDisplay.tsx`)

Displays QR codes for students to show at partner locations:

```tsx
<QRCodeDisplay
  data={qrData}
  size={300}
  brandColor="#9333ea"
  showConfirmationCode={true}
  allowDownload={true}
/>
```

**Features:**
- High-resolution QR code generation
- Confirmation code display
- Expiration warnings
- Download and print options
- Expired state handling
- Responsive design

### 3. **Partner Component** (`components/rewards/QRCodeScanner.tsx`)

Scans QR codes using device camera:

```tsx
<QRCodeScanner
  onScan={(qrData) => console.log('Scanned!', qrData)}
  onError={(error) => console.error(error)}
  partnerId="optional-filter"
/>
```

**Features:**
- Real-time camera scanning
- Manual code entry fallback
- Camera permission handling
- Automatic validation
- Error handling
- Mobile-optimized

### 4. **Student Pages**

#### Redemption Detail Page (`app/rewards/redemptions/[id]/page.tsx`)
Shows full redemption details with QR code:
- URL: `/rewards/redemptions/[id]`
- Large QR code display
- Reward and partner information
- Expiration status
- Cancel option

### 5. **Partner Pages**

#### Validation Page (`app/partners/validate/page.tsx`)
Partner interface for scanning and validating:
- URL: `/partners/validate`
- Camera scanner
- Manual entry option
- Redemption confirmation
- Recent activity log

### 6. **API Endpoint**

#### Get Single Redemption (`app/api/rewards/redemptions/[id]/route.ts`)
- `GET /api/rewards/redemptions/[id]` - Fetch redemption details
- `DELETE /api/rewards/redemptions/[id]` - Cancel and refund

---

## 🔒 Security Features

### 1. **Data Encoding**

QR codes contain encoded JSON with:
- Confirmation code (WLA-XXXX-9999 format)
- Redemption ID
- User ID
- Partner ID
- Reward ID
- Expiration timestamp
- Optional cryptographic signature

Example encoded data:
```
WLA-QR:eyJjIjoiV0xBLVhLQ0QtOTg3NiIsInIiOiIxMjM0IiwidSI6IjU2NzgiLCJwIjoiOTAxMiIsInciOiIzNDU2IiwiZSI6IjIwMjQtMTItMzFUMjM6NTk6NTlaIn0=
```

### 2. **Validation Checks**

- ✅ QR code format validation
- ✅ Expiration date checking
- ✅ Partner ID verification
- ✅ Status validation (claimed/approved only)
- ✅ Already redeemed checking
- ✅ User authentication

### 3. **Error Correction**

- High error correction level (Level H)
- 30% of QR code can be damaged and still scan
- Robust to poor lighting conditions

---

## 🎯 User Flows

### Student Flow

1. **Claim Reward**
   - Browse marketplace
   - Select reward
   - Confirm purchase with tokens
   - Redemption created

2. **View QR Code**
   - Navigate to "My Rewards"
   - Click on claimed reward
   - See QR code and confirmation code
   - Download or print if needed

3. **Redeem at Partner**
   - Go to partner location
   - Show QR code to staff
   - Staff scans code
   - Receive reward!

### Partner Flow

1. **Open Scanner**
   - Navigate to `/partners/validate`
   - Click "Start Camera"
   - Allow camera permissions

2. **Scan Student Code**
   - Point camera at QR code
   - Automatic scanning
   - View redemption details

3. **Confirm Redemption**
   - Review student and reward info
   - Click "Confirm Redemption"
   - Provide reward to student
   - Done!

### Alternative: Manual Entry

If camera doesn't work:

1. Click "Enter code manually"
2. Type confirmation code: WLA-XXXX-9999
3. Click "Validate Code"
4. Same confirmation flow

---

## 🛠️ Setup & Configuration

### 1. **Install Dependencies**

```bash
npm install qrcode @types/qrcode html5-qrcode --legacy-peer-deps
```

### 2. **Camera Permissions**

Add to `next.config.js`:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/partners/validate',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=(self)',
          },
        ],
      },
    ];
  },
};
```

### 3. **Environment Variables**

No additional environment variables needed! The system uses existing Supabase and NextAuth configuration.

---

## 📱 Mobile Optimization

### Camera Access

The scanner automatically:
- Requests back camera (environment facing)
- Falls back to front camera if unavailable
- Provides manual entry on devices without camera
- Works on iOS Safari, Android Chrome, etc.

### QR Code Display

- Responsive sizing (adapts to screen)
- High DPI support (Retina displays)
- Print-friendly styles
- Downloadable as image

### Touch Interactions

- Large tap targets (60px minimum)
- Swipe-friendly layouts
- No hover-dependent features

---

## 🎨 Customization

### Brand Colors

Customize QR code colors:

```tsx
<QRCodeDisplay
  data={qrData}
  brandColor="#FF6B35" // RAD orange
  size={400}
/>
```

### Scanner Appearance

Modify scanner styles in `QRCodeScanner.tsx`:
- Box size: `qrbox: { width: 250, height: 250 }`
- Scan frequency: `fps: 10`
- Aspect ratio: `aspectRatio: 1.0`

---

## 🐛 Troubleshooting

### Common Issues

**1. Camera Won't Start**
- Check browser permissions
- Try HTTPS (required for camera access)
- Use manual entry fallback
- Check console for errors

**2. QR Code Won't Scan**
- Ensure good lighting
- Clean camera lens
- Hold device steady
- Try increasing QR code size
- Use manual confirmation code entry

**3. "Already Redeemed" Error**
- Code was already used
- Check redemption history
- Contact support if error

**4. "Expired" Status**
- Check expiration date
- Redemptions typically expire in 30 days
- Students can cancel and re-claim if needed

### Debug Mode

Enable console logging in components:
```typescript
const DEBUG = true;
if (DEBUG) console.log('QR Data:', qrData);
```

---

## 📊 Analytics & Monitoring

### Track These Metrics

**Student Side:**
- QR codes generated
- Downloads/prints
- Redemption completion rate
- Time from claim to redemption
- Cancellation rate

**Partner Side:**
- Scan attempts
- Successful validations
- Failed validations (with reasons)
- Manual entry usage rate
- Average validation time

### Database Queries

```sql
-- Redemption conversion rate
SELECT 
  COUNT(*) FILTER (WHERE status = 'redeemed') * 100.0 / COUNT(*) as redemption_rate
FROM reward_redemptions
WHERE claimed_at > NOW() - INTERVAL '30 days';

-- Popular scanning times
SELECT 
  EXTRACT(HOUR FROM redeemed_at) as hour,
  COUNT(*) as redemptions
FROM reward_redemptions
WHERE status = 'redeemed'
GROUP BY hour
ORDER BY hour;
```

---

## 🔄 Future Enhancements

### Planned Features

1. **Offline Support**
   - Cache QR codes for offline viewing
   - Queue scans for later validation
   - Sync when connection restored

2. **Advanced Security**
   - Time-based one-time codes
   - Cryptographic signatures
   - Fraud detection algorithms

3. **Enhanced UX**
   - Animated scanning feedback
   - Augmented reality overlay
   - Voice guidance for accessibility

4. **Analytics Dashboard**
   - Real-time redemption tracking
   - Heatmaps of scan locations
   - Partner performance metrics

5. **Integration Options**
   - Apple Wallet passes
   - Google Pay integration
   - SMS delivery of codes
   - Email confirmations

---

## 💻 API Reference

### Generate QR Data

```typescript
import { generateQRCodeDataURL, type QRCodeData } from '@/lib/utils/qrcode';

const qrData: QRCodeData = {
  confirmationCode: 'WLA-XKCD-9876',
  redemptionId: 'uuid-here',
  userId: 'user-uuid',
  partnerId: 'partner-uuid',
  rewardId: 'reward-uuid',
  expiresAt: '2024-12-31T23:59:59Z',
};

const dataURL = await generateQRCodeDataURL(qrData, {
  width: 300,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF',
  },
});
```

### Validate Redemption

```typescript
// Client-side
const response = await fetch('/api/rewards/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    confirmationCode: 'WLA-XKCD-9876',
    partnerId: 'optional-uuid',
  }),
});

const { valid, redemption, error } = await response.json();
```

### Mark as Redeemed

```typescript
// Client-side
const response = await fetch('/api/rewards/validate', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    confirmationCode: 'WLA-XKCD-9876',
    notes: 'Optional partner notes',
  }),
});

const { success, redemption } = await response.json();
```

---

## 📞 Support

### For Students
- **Can't see QR code?** Try refreshing the page or downloading the code
- **Code expired?** Cancel the redemption and claim again
- **Partner won't accept?** Show confirmation code manually

### For Partners
- **Scanner not working?** Use manual entry with confirmation code
- **Invalid code error?** Code may be expired, redeemed, or cancelled
- **Need help?** Contact support@wildpraxis.com

---

## ✅ Testing Checklist

### Before Launch

- [ ] Test QR generation on various devices
- [ ] Test camera scanning on iOS and Android
- [ ] Test manual entry fallback
- [ ] Test expired redemption handling
- [ ] Test already-redeemed checking
- [ ] Test cancellation and refund flow
- [ ] Test with poor lighting conditions
- [ ] Test print functionality
- [ ] Test download functionality
- [ ] Verify security validations
- [ ] Load test with multiple concurrent scans
- [ ] Test offline behavior
- [ ] Verify analytics tracking
- [ ] Test partner-specific filtering

---

## 🎓 Training Materials

### For Students

**How to Use Your QR Code:**
1. Go to "My Rewards" in the app
2. Click on your claimed reward
3. Show the QR code to staff at the partner location
4. Or tell them your confirmation code
5. Enjoy your reward!

### For Partners

**How to Validate Rewards:**
1. Go to the validation page
2. Click "Start Camera"
3. Point at the student's QR code
4. Review the redemption details
5. Click "Confirm Redemption"
6. Provide the reward to the student

**Manual Entry:**
1. Click "Enter manually"
2. Ask student for confirmation code
3. Type the code (WLA-XXXX-9999)
4. Click "Validate"
5. Confirm and provide reward

---

## 📄 License

This QR system is part of the WildPraxis RAD Pass platform.  
© 2024 WildPraxis Education Technology  
All Rights Reserved

