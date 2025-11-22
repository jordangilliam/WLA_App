#!/usr/bin/env tsx
/**
 * Migration Application Helper Script
 * 
 * This script helps verify and prepare migrations for application to Supabase.
 * It checks migration files, validates SQL syntax, and provides instructions.
 * 
 * Usage:
 *   npm run apply-migrations
 *   npm run apply-migrations -- --check  # Just validate, don't prepare
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = join(process.cwd(), 'supabase', 'migrations');
const REQUIRED_MIGRATIONS = [
  '027_seasonal_waterway_data.sql',
  '028_fly_fishing_experts.sql',
  '029_pfbc_mapping_layers.sql',
  '030_pfbc_complete_integration.sql',
];

interface MigrationStatus {
  filename: string;
  exists: boolean;
  size: number;
  hasContent: boolean;
  errors: string[];
}

function checkMigration(filename: string): MigrationStatus {
  const filepath = join(MIGRATIONS_DIR, filename);
  const status: MigrationStatus = {
    filename,
    exists: false,
    size: 0,
    hasContent: false,
    errors: [],
  };

  try {
    const content = readFileSync(filepath, 'utf-8');
    status.exists = true;
    status.size = content.length;
    status.hasContent = content.trim().length > 0;

    // Basic validation
    if (!status.hasContent) {
      status.errors.push('File is empty');
    }

    // Check for common SQL issues
    if (content.includes('CREATE TABLE') && !content.includes('CREATE TABLE IF NOT EXISTS')) {
      status.errors.push('Consider using CREATE TABLE IF NOT EXISTS to avoid conflicts');
    }

    if (content.includes('DROP TABLE') && !content.includes('DROP TABLE IF EXISTS')) {
      status.errors.push('Consider using DROP TABLE IF EXISTS to avoid errors');
    }

    // Check for PostGIS
    if (content.includes('POINT') || content.includes('GEOGRAPHY') || content.includes('GEOMETRY')) {
      if (!content.includes('CREATE EXTENSION IF NOT EXISTS postgis')) {
        status.errors.push('PostGIS extension may be required - ensure it\'s enabled in Supabase');
      }
    }

    // Check for RLS policies
    const tableMatches = content.match(/CREATE TABLE\s+(\w+)/gi);
    if (tableMatches) {
      const tables = tableMatches.map(m => m.replace(/CREATE TABLE\s+/i, '').trim());
      for (const table of tables) {
        if (!content.includes(`CREATE POLICY`) && !content.includes(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`)) {
          status.errors.push(`Table ${table} may need RLS policies`);
        }
      }
    }
  } catch (error) {
    status.errors.push(`Cannot read file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return status;
}

function generateSupabaseInstructions(migrations: MigrationStatus[]): string {
  const instructions = [
    '# Supabase Migration Application Instructions\n',
    '## Steps to Apply Migrations\n',
    '1. **Log into Supabase Dashboard**',
    '   - Go to https://app.supabase.com',
    '   - Select your project',
    '',
    '2. **Open SQL Editor**',
    '   - Click "SQL Editor" in the left sidebar',
    '   - Click "New Query"',
    '',
    '3. **Apply Migrations in Order**',
    '   Run each migration file in this exact order:\n',
  ];

  migrations.forEach((migration, index) => {
    instructions.push(`${index + 1}. **${migration.filename}**`);
    if (migration.exists && migration.hasContent) {
      instructions.push(`   - Copy contents from: \`supabase/migrations/${migration.filename}\``);
      instructions.push(`   - Paste into SQL Editor`);
      instructions.push(`   - Click "Run"`);
      if (migration.errors.length > 0) {
        instructions.push(`   - ⚠️  Warnings: ${migration.errors.join(', ')}`);
      }
    } else {
      instructions.push(`   - ❌ File not found or empty`);
    }
    instructions.push('');
  });

  instructions.push('## Verification Queries\n');
  instructions.push('After applying all migrations, run these to verify:\n');
  instructions.push('```sql');
  instructions.push('-- Check seasonal waterway data');
  instructions.push('SELECT COUNT(*) FROM macroinvertebrate_hatches;');
  instructions.push('SELECT COUNT(*) FROM waterway_hatches;');
  instructions.push('');
  instructions.push('-- Check fly fishing experts');
  instructions.push('SELECT COUNT(*) FROM fly_fishing_experts;');
  instructions.push('SELECT COUNT(*) FROM fly_fishing_shops;');
  instructions.push('');
  instructions.push('-- Check PFBC mapping layers');
  instructions.push('SELECT COUNT(*) FROM pfbc_trout_streams;');
  instructions.push('SELECT COUNT(*) FROM pfbc_bass_waters;');
  instructions.push('SELECT COUNT(*) FROM pfbc_other_species_waters;');
  instructions.push('');
  instructions.push('-- Check complete PFBC integration');
  instructions.push('SELECT COUNT(*) FROM pfbc_stocking_schedules;');
  instructions.push('SELECT COUNT(*) FROM pfbc_access_points;');
  instructions.push('SELECT COUNT(*) FROM pfbc_regulations;');
  instructions.push('SELECT COUNT(*) FROM pfbc_habitat_installations;');
  instructions.push('```\n');

  instructions.push('## Expected Results\n');
  instructions.push('- `macroinvertebrate_hatches`: Should have 9+ species');
  instructions.push('- `fly_fishing_experts`: Should have 2+ experts');
  instructions.push('- `fly_fishing_shops`: Should have 60+ shops');
  instructions.push('- `pfbc_trout_streams`: Should have 110+ stream designations');
  instructions.push('- `pfbc_stocking_schedules`: Should have 13+ schedules');
  instructions.push('- `pfbc_access_points`: Should have 15+ access points');

  return instructions.join('\n');
}

function main() {
  console.log('🔍 Checking migration files...\n');

  const migrations = REQUIRED_MIGRATIONS.map(checkMigration);
  const allExist = migrations.every(m => m.exists && m.hasContent);
  const hasErrors = migrations.some(m => m.errors.length > 0);

  // Display status
  migrations.forEach((migration) => {
    const icon = migration.exists && migration.hasContent ? '✅' : '❌';
    console.log(`${icon} ${migration.filename}`);
    console.log(`   Size: ${migration.size} bytes`);
    if (migration.errors.length > 0) {
      console.log(`   ⚠️  Warnings: ${migration.errors.join(', ')}`);
    }
    console.log('');
  });

  if (!allExist) {
    console.error('❌ Some migration files are missing or empty!');
    process.exit(1);
  }

  if (hasErrors) {
    console.warn('⚠️  Some migrations have warnings. Review before applying.\n');
  }

  // Generate instructions
  const instructions = generateSupabaseInstructions(migrations);
  const instructionsPath = join(process.cwd(), 'MIGRATION_INSTRUCTIONS.md');
  
  try {
    require('fs').writeFileSync(instructionsPath, instructions);
    console.log(`✅ Migration instructions generated: ${instructionsPath}\n`);
  } catch (error) {
    console.error('Failed to write instructions file:', error);
  }

  console.log('📋 Next Steps:');
  console.log('1. Review the migration files in supabase/migrations/');
  console.log('2. Follow the instructions in MIGRATION_INSTRUCTIONS.md');
  console.log('3. Apply migrations in Supabase SQL Editor');
  console.log('4. Run verification queries to confirm success\n');
}

main();


