/**
 * Printable AR Marker Generator
 * Creates printable AR marker images using canvas/SVG
 * Based on real mission location data from database
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Generate SVG AR marker pattern
 * Creates a printable marker with unique pattern based on location data
 */
function generateSVGMarker(
  locationId: string,
  locationName: string,
  missionName: string,
  qrCode?: string
): string {
  // Create unique pattern hash from location ID
  const hash = locationId.split('-')[0].substring(0, 8)
  const pattern = hash.split('').map((char) => parseInt(char, 16) % 4)
  
  const size = 400
  const border = 40
  const cellSize = (size - border * 2) / 4
  
  let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="white"/>
  <rect x="${border}" y="${border}" width="${size - border * 2}" height="${size - border * 2}" fill="black"/>
  
  <!-- Corner markers -->
  <rect x="${border}" y="${border}" width="${cellSize}" height="${cellSize}" fill="white"/>
  <rect x="${size - border - cellSize}" y="${border}" width="${cellSize}" height="${cellSize}" fill="white"/>
  <rect x="${border}" y="${size - border - cellSize}" width="${cellSize}" height="${cellSize}" fill="white"/>
  <rect x="${size - border - cellSize}" y="${size - border - cellSize}" width="${cellSize}" height="${cellSize}" fill="white"/>
  
  <!-- Pattern cells based on hash -->
`

  // Generate pattern cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (i === 0 && j === 0) continue // Skip corner
      if (i === 0 && j === 3) continue
      if (i === 3 && j === 0) continue
      if (i === 3 && j === 3) continue
      
      const cellX = border + cellSize + (j * cellSize)
      const cellY = border + cellSize + (i * cellSize)
      const fill = pattern[(i * 4 + j) % pattern.length] % 2 === 0 ? 'white' : 'black'
      
      svg += `  <rect x="${cellX}" y="${cellY}" width="${cellSize * 0.8}" height="${cellSize * 0.8}" fill="${fill}"/>\n`
    }
  }

  svg += `</svg>`
  
  return svg
}

/**
 * Generate printable HTML page with marker
 */
function generatePrintablePage(
  locationId: string,
  locationName: string,
  missionName: string,
  svgMarker: string,
  qrCode?: string
): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AR Marker: ${locationName}</title>
  <style>
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #f5f5f5;
    }
    .marker-page {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .marker-container {
      text-align: center;
      margin: 30px 0;
      padding: 20px;
      background: #fafafa;
      border-radius: 8px;
    }
    .marker-svg {
      display: block;
      margin: 0 auto;
      border: 2px solid #6366f1;
      border-radius: 8px;
    }
    .info-section {
      margin-top: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #6366f1;
    }
    .info-section h3 {
      margin-top: 0;
      color: #1e293b;
    }
    .info-section ul, .info-section ol {
      line-height: 1.8;
    }
    .qr-code-section {
      margin-top: 20px;
      padding: 20px;
      background: #e0e7ff;
      border-radius: 8px;
      text-align: center;
    }
    .qr-code-text {
      font-family: monospace;
      font-size: 14px;
      background: white;
      padding: 10px;
      border-radius: 4px;
      word-break: break-all;
    }
    .print-btn {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background: #6366f1;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      border: none;
    }
    .print-btn:hover {
      background: #4f46e5;
    }
  </style>
</head>
<body>
  <div class="marker-page">
    <h1>🔍 AR Marker: ${locationName}</h1>
    <p><strong>Mission:</strong> ${missionName}</p>
    <p><strong>Location ID:</strong> ${locationId}</p>
    
    <div class="marker-container">
      <h2>Print This Marker</h2>
      <div class="marker-svg">
        ${svgMarker}
      </div>
      <p style="margin-top: 15px; color: #64748b;">
        Place this marker at: <strong>${locationName}</strong>
      </p>
    </div>

    ${qrCode ? `
    <div class="qr-code-section">
      <h3>📱 QR Code Data</h3>
      <p>If QR code scanning is required, use this code:</p>
      <div class="qr-code-text">${qrCode}</div>
      <p style="font-size: 12px; color: #64748b; margin-top: 10px;">
        You can generate a QR code image from this text using any QR code generator.
      </p>
    </div>
    ` : ''}

    <div class="info-section">
      <h3>📋 Printing Instructions</h3>
      <ol>
        <li><strong>Size:</strong> Print marker at least 4" x 4" (10cm x 10cm) for best detection</li>
        <li><strong>Paper:</strong> Use white, matte paper for best contrast</li>
        <li><strong>Quality:</strong> Print at highest quality setting (600 DPI recommended)</li>
        <li><strong>Contrast:</strong> Ensure black areas are truly black, white areas are truly white</li>
        <li><strong>Lamination:</strong> Consider laminating for outdoor use</li>
      </ol>
      
      <h3>🎯 Placement Guidelines</h3>
      <ul>
        <li>Place marker on a flat, stable surface</li>
        <li>Ensure marker is well-lit (avoid shadows)</li>
        <li>Keep marker clean and free of wrinkles</li>
        <li>Position marker at eye level when possible</li>
        <li>Allow 2-3 feet distance for scanning</li>
      </ul>
      
      <h3>🔍 Using the Marker</h3>
      <ol>
        <li>Open the mission in the app</li>
        <li>Navigate to the location</li>
        <li>Tap "Use AR View" button</li>
        <li>Point camera at this marker</li>
        <li>Wait for AR overlay to appear</li>
      </ol>
    </div>
    
    <div class="no-print" style="text-align: center; margin-top: 30px;">
      <button class="print-btn" onclick="window.print()">🖨️ Print Marker</button>
    </div>
  </div>
</body>
</html>`
}

async function generatePrintableMarkers() {
  console.log('🖨️  Starting printable AR marker generation...\n')

  try {
    // Fetch mission locations
    const { data: locations, error } = await supabase
      .from('mission_locations')
      .select(`
        *,
        story_missions (
          id,
          title
        )
      `)
      .in('location_type', ['ar_marker', 'qr_code'])
      .order('mission_id', { ascending: true })

    if (error) {
      console.error('❌ Failed to fetch locations:', error)
      process.exit(1)
    }

    if (!locations || locations.length === 0) {
      console.log('⚠️  No locations found that need markers')
      return
    }

    // Create output directories
    const outputDir = path.join(process.cwd(), 'public', 'ar-markers')
    const htmlDir = path.join(outputDir, 'html')
    const svgDir = path.join(outputDir, 'svg')
    
    for (const dir of [outputDir, htmlDir, svgDir]) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    }

    console.log(`📁 Output directories:`)
    console.log(`   HTML: ${htmlDir}`)
    console.log(`   SVG: ${svgDir}\n`)

    let generatedCount = 0

    for (const location of locations) {
      const mission = (location as any).story_missions
      const missionName = mission?.title || 'Unknown Mission'
      const locationName = location.custom_name || 'Unknown Location'
      const locationId = location.id
      const qrCode = location.qr_code_data

      // Generate SVG marker
      const svgMarker = generateSVGMarker(locationId, locationName, missionName, qrCode)
      
      // Save SVG file
      const svgFilename = `marker-${locationId}.svg`
      const svgPath = path.join(svgDir, svgFilename)
      fs.writeFileSync(svgPath, svgMarker)
      
      // Generate printable HTML
      const printableHtml = generatePrintablePage(locationId, locationName, missionName, svgMarker, qrCode)
      const htmlFilename = `marker-${locationId}.html`
      const htmlPath = path.join(htmlDir, htmlFilename)
      fs.writeFileSync(htmlPath, printableHtml)

      console.log(`✅ Generated marker for: ${locationName}`)
      console.log(`   Mission: ${missionName}`)
      console.log(`   SVG: ${svgFilename}`)
      console.log(`   HTML: ${htmlFilename}`)
      if (qrCode) {
        console.log(`   QR Code: ${qrCode.substring(0, 30)}...`)
      }
      console.log()
      
      generatedCount++
    }

    console.log(`\n✨ Marker generation complete!\n`)
    console.log(`Summary:`)
    console.log(`  - ${generatedCount} markers generated`)
    console.log(`  - SVG files: public/ar-markers/svg/`)
    console.log(`  - HTML files: public/ar-markers/html/`)
    console.log(`\n📋 Next steps:`)
    console.log(`  1. Open HTML files in a browser`)
    console.log(`  2. Click "Print Marker" button`)
    console.log(`  3. Print at 4" x 4" minimum size`)
    console.log(`  4. Place markers at mission locations`)
    console.log(`  5. Test AR detection in the app`)

  } catch (error) {
    console.error('❌ Generation failed:', error)
    process.exit(1)
  }
}

// Run the generator
generatePrintableMarkers()


