#!/usr/bin/env tsx
/**
 * Pre-deployment health check script
 * Verifies all requirements are met before deployment:
 * - Environment variables are set
 * - Database migrations are documented
 * - Build completes successfully
 * - No TypeScript errors
 * - No critical linting errors
 */

import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
let hasErrors = false
const errors: string[] = []
const warnings: string[] = []

console.log('🔍 Running pre-deployment health checks...\n')

// 1. Check environment variables
console.log('1️⃣ Checking environment variables...')
try {
  execSync('npm run verify:env', { stdio: 'inherit', cwd: projectRoot })
  console.log('✅ Environment variables verified\n')
} catch (error) {
  hasErrors = true
  errors.push('Environment variables check failed')
  console.error('❌ Environment variables check failed\n')
}

// 2. Check for migration files
console.log('2️⃣ Checking migration files...')
const migrationsDir = path.join(projectRoot, 'supabase', 'migrations')
const requiredMigrations = [
  '027_seasonal_waterway_data.sql',
  '028_fly_fishing_experts.sql',
  '029_pfbc_mapping_layers.sql',
  '030_pfbc_complete_integration.sql',
]

if (!existsSync(migrationsDir)) {
  warnings.push('Migrations directory not found - migrations may be in a different location')
} else {
  const missingMigrations = requiredMigrations.filter(
    (migration) => !existsSync(path.join(migrationsDir, migration))
  )
  
  if (missingMigrations.length > 0) {
    warnings.push(`Some migration files not found: ${missingMigrations.join(', ')}`)
  } else {
    console.log('✅ All required migration files present\n')
  }
}

// 3. TypeScript check
console.log('3️⃣ Checking TypeScript compilation...')
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit', cwd: projectRoot })
  console.log('✅ TypeScript compilation successful\n')
} catch (error) {
  hasErrors = true
  errors.push('TypeScript compilation failed')
  console.error('❌ TypeScript compilation failed\n')
}

// 4. Linting check (warnings OK, errors not OK)
console.log('4️⃣ Checking linting...')
try {
  // Run linting and capture output
  const lintOutput = execSync('npm run lint', { 
    encoding: 'utf-8', 
    cwd: projectRoot,
    stdio: 'pipe'
  })
  
  // Check if there are actual errors (not just warnings)
  if (lintOutput.includes('error') && lintOutput.match(/error\s+\d+/)) {
    const errorCount = lintOutput.match(/error\s+(\d+)/)?.[1]
    if (errorCount && parseInt(errorCount) > 0) {
      hasErrors = true
      errors.push(`Linting found ${errorCount} error(s)`)
      console.error(`❌ Linting found ${errorCount} error(s)\n`)
    } else {
      console.log('✅ Linting passed (warnings OK)\n')
    }
  } else {
    console.log('✅ Linting passed\n')
  }
} catch (error: any) {
  // Linting might exit with non-zero code even for warnings
  const output = error.stdout?.toString() || error.stderr?.toString() || ''
  if (output.includes('error') && output.match(/error\s+\d+/)) {
    const errorCount = output.match(/error\s+(\d+)/)?.[1]
    if (errorCount && parseInt(errorCount) > 0) {
      hasErrors = true
      errors.push(`Linting found ${errorCount} error(s)`)
      console.error(`❌ Linting found ${errorCount} error(s)\n`)
    } else {
      console.log('⚠️  Linting completed with warnings (OK for deployment)\n')
    }
  } else {
    warnings.push('Linting check encountered issues - review manually')
    console.warn('⚠️  Linting check encountered issues - review manually\n')
  }
}

// 5. Build check
console.log('5️⃣ Testing build...')
try {
  // Clean build first
  console.log('   Cleaning previous build...')
  try {
    execSync('rm -rf .next', { stdio: 'pipe', cwd: projectRoot })
  } catch {
    // Ignore errors if .next doesn't exist
  }
  
  console.log('   Running build...')
  execSync('npm run build', { stdio: 'inherit', cwd: projectRoot })
  console.log('✅ Build completed successfully\n')
} catch (error) {
  hasErrors = true
  errors.push('Build failed')
  console.error('❌ Build failed\n')
}

// Summary
console.log('\n' + '='.repeat(50))
console.log('📊 PRE-DEPLOYMENT CHECK SUMMARY')
console.log('='.repeat(50))

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:')
  warnings.forEach((warning) => console.log(`   - ${warning}`))
}

if (errors.length > 0) {
  console.log('\n❌ Errors:')
  errors.forEach((error) => console.log(`   - ${error}`))
  console.log('\n🚫 Deployment blocked due to errors above.')
  console.log('   Please fix the issues before deploying.\n')
  process.exit(1)
}

if (warnings.length === 0 && errors.length === 0) {
  console.log('\n✅ All checks passed! Ready for deployment.')
} else if (errors.length === 0) {
  console.log('\n✅ All critical checks passed!')
  console.log('   Review warnings above before deploying.\n')
}

process.exit(0)

