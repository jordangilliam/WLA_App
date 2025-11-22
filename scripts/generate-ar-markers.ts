/**
 * AR Marker Generator
 * Creates AR marker images based on real mission location data
 * 
 * Uses AR.js marker pattern format for compatibility
 * 
 * Usage:
 * npx tsx scripts/generate-ar-markers.ts
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
 * Generate AR marker pattern HTML
 * This creates an HTML file that can be used to generate AR markers
 * using AR.js marker generator or similar tools
 */
function generateMarkerPattern(locationId: string, locationName: string, missionName: string): string {
  // Create a unique pattern based on location data
  const patternData = `${missionName}-${locationName}-${locationId}`.substring(0, 16)
  
  return `
<!DOCTYPE html>
<html>
<head>
  <title>AR Marker: ${locationName}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #1a1a2e;
      color: white;
    }
    .marker-container {
      background: white;
      padding: 40px;
      border-radius: 12px;
      text-align: center;
      margin: 20px 0;
    }
    .marker-pattern {
      width: 400px;
      height: 400px;
      margin: 0 auto;
      border: 4px solid #6366f1;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
      color: #1a1a2e;
      position: relative;
    }
    .marker-pattern::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      width: 80px;
      height: 80px;
      border: 8px solid #1a1a2e;
      border-radius: 4px;
    }
    .marker-pattern::after {
      content: '';
      position: absolute;
      bottom: 20px;
      right: 20px;
      width: 80px;
      height: 80px;
      border: 8px solid #1a1a2e;
      border-radius: 4px;
    }
    .info {
      margin-top: 20px;
      padding: 20px;
      background: #16213e;
      border-radius: 8px;
    }
    .download-btn {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background: #6366f1;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>🔍 AR Marker: ${locationName}</h1>
  <p><strong>Mission:</strong> ${missionName}</p>
  <p><strong>Location ID:</strong> ${locationId}</p>
  
  <div class="marker-container">
    <div class="marker-pattern">
      ${patternData}
    </div>
    <p style="margin-top: 20px; color: #1a1a2e;">
      Print this marker and place it at: <strong>${locationName}</strong>
    </p>
  </div>
  
  <div class="info">
    <h3>📋 Instructions:</h3>
    <ol>
      <li>Print this marker on white paper (8.5" x 11" recommended)</li>
      <li>Ensure good contrast - black on white works best</li>
      <li>Place marker at the location specified in the mission</li>
      <li>Ensure marker is flat and well-lit</li>
      <li>Use the app's AR view to scan this marker</li>
    </ol>
    
    <h3>🎯 For Better Detection:</h3>
    <ul>
      <li>Use high-contrast printing</li>
      <li>Laminate the marker for durability</li>
      <li>Ensure marker is at least 4" x 4" in size</li>
      <li>Keep marker flat - avoid wrinkles or folds</li>
      <li>Good lighting improves detection</li>
    </ul>
  </div>
  
  <a href="#" class="download-btn" onclick="window.print()">🖨️ Print Marker</a>
</body>
</html>
  `.trim()
}

/**
 * Generate QR code data for locations
 */
function generateQRCodeData(locationId: string, missionId: string, locationName: string): string {
  // Create a structured QR code payload
  const payload = {
    type: 'mission_location',
    missionId,
    locationId,
    locationName,
    timestamp: new Date().toISOString(),
  }
  
  // In production, you might want to encrypt this
  return JSON.stringify(payload)
}

async function generateARMarkers() {
  console.log('🔍 Starting AR marker generation...\n')

  try {
    // Fetch all mission locations that need AR markers
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
      console.log('⚠️  No locations found that need AR markers')
      return
    }

    // Create output directory
    const outputDir = path.join(process.cwd(), 'public', 'ar-markers')
    const htmlDir = path.join(process.cwd(), 'public', 'ar-markers', 'html')
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    if (!fs.existsSync(htmlDir)) {
      fs.mkdirSync(htmlDir, { recursive: true })
    }

    console.log(`📁 Output directory: ${outputDir}\n`)

    let generatedCount = 0

    for (const location of locations) {
      const mission = (location as any).story_missions
      const missionName = mission?.title || 'Unknown Mission'
      const locationName = location.custom_name || 'Unknown Location'
      const locationId = location.id
      const missionId = location.mission_id

      // Generate marker HTML
      const markerHtml = generateMarkerPattern(locationId, locationName, missionName)
      
      // Save HTML file
      const htmlFilename = `marker-${locationId}.html`
      const htmlPath = path.join(htmlDir, htmlFilename)
      fs.writeFileSync(htmlPath, markerHtml)
      
      // Generate QR code data if needed
      if (location.location_type === 'qr_code' && !location.qr_code_data) {
        const qrData = generateQRCodeData(locationId, missionId, locationName)
        console.log(`📱 QR Code for ${locationName}: ${qrData}`)
        
        // Update database with QR code data
        await supabase
          .from('mission_locations')
          .update({ qr_code_data: qrData })
          .eq('id', locationId)
      }

      console.log(`✅ Generated marker for: ${locationName}`)
      console.log(`   Mission: ${missionName}`)
      console.log(`   HTML: ${htmlFilename}`)
      console.log(`   Location ID: ${locationId}\n`)
      
      generatedCount++
    }

    console.log(`\n✨ AR marker generation complete!\n`)
    console.log(`Summary:`)
    console.log(`  - ${generatedCount} markers generated`)
    console.log(`  - HTML files saved to: public/ar-markers/html/`)
    console.log(`\n📋 Next steps:`)
    console.log(`  1. Open HTML files in a browser`)
    console.log(`  2. Print each marker (use Print button)`)
    console.log(`  3. Place markers at the mission locations`)
    console.log(`  4. Test AR detection using the app's AR view`)
    console.log(`\n💡 Tip: For better AR detection, use a professional marker generator:`)
    console.log(`   https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html`)

  } catch (error) {
    console.error('❌ Generation failed:', error)
    process.exit(1)
  }
}

// Run the generator
generateARMarkers()


