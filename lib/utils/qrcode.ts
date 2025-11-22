/**
 * QR Code Utilities for RAD Pass Rewards
 * Handles QR code generation and data encoding/decoding
 */

import QRCode from 'qrcode';

export interface QRCodeData {
  confirmationCode: string;
  redemptionId: string;
  userId: string;
  partnerId: string;
  rewardId: string;
  expiresAt: string;
  signature?: string; // Optional cryptographic signature for security
}

/**
 * Generate QR code data string from redemption information
 */
export function encodeQRData(data: QRCodeData): string {
  // Create a compact, URL-safe encoded string
  const payload = {
    c: data.confirmationCode,
    r: data.redemptionId,
    u: data.userId,
    p: data.partnerId,
    w: data.rewardId,
    e: data.expiresAt,
    ...(data.signature && { s: data.signature }),
  };
  
  // Base64 encode for compactness
  const jsonString = JSON.stringify(payload);
  const encoded = Buffer.from(jsonString).toString('base64');
  
  // Add prefix for validation
  return `WLA-QR:${encoded}`;
}

/**
 * Decode QR code data string back to object
 */
export function decodeQRData(qrString: string): QRCodeData | null {
  try {
    // Check prefix
    if (!qrString.startsWith('WLA-QR:')) {
      return null;
    }
    
    // Remove prefix and decode
    const encoded = qrString.replace('WLA-QR:', '');
    const jsonString = Buffer.from(encoded, 'base64').toString('utf-8');
    const payload = JSON.parse(jsonString);
    
    // Reconstruct full object
    return {
      confirmationCode: payload.c,
      redemptionId: payload.r,
      userId: payload.u,
      partnerId: payload.p,
      rewardId: payload.w,
      expiresAt: payload.e,
      signature: payload.s,
    };
  } catch (error) {
    console.error('Error decoding QR data:', error);
    return null;
  }
}

/**
 * Generate QR code as Data URL (for display in img tags)
 */
export async function generateQRCodeDataURL(
  data: QRCodeData,
  options?: {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }
): Promise<string> {
  const qrString = encodeQRData(data);
  
  const qrOptions: QRCode.QRCodeToDataURLOptions = {
    width: options?.width || 300,
    margin: options?.margin || 2,
    color: {
      dark: options?.color?.dark || '#000000',
      light: options?.color?.light || '#FFFFFF',
    },
    errorCorrectionLevel: 'H', // High error correction for damaged codes
  };
  
  return await QRCode.toDataURL(qrString, qrOptions);
}

/**
 * Generate QR code as Canvas (for more control)
 */
export async function generateQRCodeCanvas(
  canvas: HTMLCanvasElement,
  data: QRCodeData,
  options?: {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }
): Promise<void> {
  const qrString = encodeQRData(data);
  
  const qrOptions: QRCode.QRCodeToCanvasOptions = {
    width: options?.width || 300,
    margin: options?.margin || 2,
    color: {
      dark: options?.color?.dark || '#000000',
      light: options?.color?.light || '#FFFFFF',
    },
    errorCorrectionLevel: 'H',
  };
  
  await QRCode.toCanvas(canvas, qrString, qrOptions);
}

/**
 * Validate QR code data
 */
export function validateQRData(data: QRCodeData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check required fields
  if (!data.confirmationCode) errors.push('Missing confirmation code');
  if (!data.redemptionId) errors.push('Missing redemption ID');
  if (!data.userId) errors.push('Missing user ID');
  if (!data.partnerId) errors.push('Missing partner ID');
  if (!data.rewardId) errors.push('Missing reward ID');
  if (!data.expiresAt) errors.push('Missing expiration date');
  
  // Check expiration
  const expiresAt = new Date(data.expiresAt);
  const now = new Date();
  if (expiresAt < now) {
    errors.push('QR code has expired');
  }
  
  // Check confirmation code format
  if (data.confirmationCode && !data.confirmationCode.match(/^WLA-[A-Z0-9]{4}-[0-9]{4}$/)) {
    errors.push('Invalid confirmation code format');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate a printable QR code with redemption details
 */
export async function generatePrintableQR(
  data: QRCodeData,
  rewardName: string,
  partnerName: string
): Promise<string> {
  // Generate QR code
  const qrDataURL = await generateQRCodeDataURL(data, { width: 400 });
  
  // Create HTML for printing
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>RAD Pass Reward - ${data.confirmationCode}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            text-align: center;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .qr-code {
            margin: 30px auto;
            padding: 20px;
            border: 3px solid #667eea;
            border-radius: 10px;
            display: inline-block;
            background: white;
          }
          .confirmation-code {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            margin: 20px 0;
            letter-spacing: 2px;
          }
          .details {
            text-align: left;
            margin: 20px 0;
            padding: 15px;
            background: #f7f7f7;
            border-radius: 5px;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎁 RAD Pass Reward</h1>
          <p>Your ticket to amazing experiences!</p>
        </div>
        
        <h2>${rewardName}</h2>
        <h3>at ${partnerName}</h3>
        
        <div class="qr-code">
          <img src="${qrDataURL}" alt="QR Code" />
        </div>
        
        <div class="confirmation-code">
          ${data.confirmationCode}
        </div>
        
        <div class="details">
          <p><strong>Instructions:</strong></p>
          <ol>
            <li>Present this QR code at ${partnerName}</li>
            <li>Staff will scan to validate</li>
            <li>Enjoy your reward!</li>
          </ol>
          <p><strong>Expires:</strong> ${new Date(data.expiresAt).toLocaleDateString()}</p>
        </div>
        
        <div class="footer">
          <p>WildPraxis RAD Pass Program</p>
          <p>Questions? Contact support@wildpraxis.com</p>
        </div>
        
        <button class="no-print" onclick="window.print()">Print This Ticket</button>
      </body>
    </html>
  `;
  
  return html;
}

/**
 * Create a downloadable QR code image
 */
export async function downloadQRCode(
  data: QRCodeData,
  filename: string = 'rad-pass-qr.png'
): Promise<void> {
  const dataURL = await generateQRCodeDataURL(data, { width: 600 });
  
  // Create download link
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Check if device has camera access for scanning
 */
export async function checkCameraAccess(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    });
    
    // Stop the stream immediately
    stream.getTracks().forEach(track => track.stop());
    
    return true;
  } catch (error) {
    console.error('Camera access denied:', error);
    return false;
  }
}

/**
 * Format confirmation code for display (add dashes)
 */
export function formatConfirmationCode(code: string): string {
  // Already formatted
  if (code.includes('-')) return code;
  
  // Add dashes: WLA-XXXX-9999
  if (code.length === 12) {
    return `${code.slice(0, 3)}-${code.slice(3, 7)}-${code.slice(7)}`;
  }
  
  return code;
}

/**
 * Parse confirmation code from various formats
 */
export function parseConfirmationCode(input: string): string | null {
  // Remove spaces and convert to uppercase
  const cleaned = input.replace(/\s/g, '').toUpperCase();
  
  // Match patterns:
  // WLA-XXXX-9999 or WLAXXXX9999
  const match = cleaned.match(/^WLA-?([A-Z0-9]{4})-?([0-9]{4})$/);
  
  if (match) {
    return `WLA-${match[1]}-${match[2]}`;
  }
  
  return null;
}

