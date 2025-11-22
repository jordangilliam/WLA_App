#!/usr/bin/env tsx
/**
 * Database Verification Script
 * Verifies all tables exist and have expected data counts
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface TableCheck {
  table: string;
  expectedMin: number;
  actual: number;
  status: 'pass' | 'fail' | 'warning';
  error?: string;
}

const tableChecks: TableCheck[] = [];

/**
 * Check table row count
 */
async function checkTable(
  tableName: string,
  expectedMin: number
): Promise<TableCheck> {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      return {
        table: tableName,
        expectedMin,
        actual: 0,
        status: 'fail',
        error: error.message,
      };
    }

    const actual = count || 0;
    let status: 'pass' | 'fail' | 'warning' = 'pass';

    if (actual < expectedMin) {
      status = actual === 0 ? 'fail' : 'warning';
    }

    return {
      table: tableName,
      expectedMin,
      actual,
      status,
    };
  } catch (error) {
    return {
      table: tableName,
      expectedMin,
      actual: 0,
      status: 'fail',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Verify database connection
 */
async function verifyConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Run all database verification checks
 */
async function runVerification() {
  console.log('🔍 Verifying Database Tables and Data\n');
  console.log(`Supabase URL: ${supabaseUrl}\n`);

  // Verify connection
  console.log('1️⃣ Checking database connection...');
  const connected = await verifyConnection();
  if (!connected) {
    console.error('❌ Failed to connect to database');
    process.exit(1);
  }
  console.log('✅ Database connection successful\n');

  // Check all tables
  console.log('2️⃣ Checking table row counts...\n');

  // Macroinvertebrate hatches
  tableChecks.push(await checkTable('macroinvertebrate_hatches', 9));

  // Waterway hatches (associations)
  tableChecks.push(await checkTable('waterway_hatches', 1));

  // Fly fishing experts
  tableChecks.push(await checkTable('fly_fishing_experts', 2));

  // Expert techniques
  tableChecks.push(await checkTable('expert_techniques', 1));

  // Expert patterns
  tableChecks.push(await checkTable('expert_patterns', 1));

  // Fly fishing shops
  tableChecks.push(await checkTable('fly_fishing_shops', 60));

  // PFBC tables
  tableChecks.push(await checkTable('pfbc_trout_streams', 110));
  tableChecks.push(await checkTable('pfbc_bass_waters', 1));
  tableChecks.push(await checkTable('pfbc_other_species_waters', 1));
  tableChecks.push(await checkTable('pfbc_stocking_schedules', 13));
  tableChecks.push(await checkTable('pfbc_access_points', 15));
  tableChecks.push(await checkTable('pfbc_regulations', 1));
  tableChecks.push(await checkTable('pfbc_habitat_installations', 1));

  // Print results
  console.log('='.repeat(70));
  console.log('📊 VERIFICATION RESULTS');
  console.log('='.repeat(70) + '\n');

  const passed = tableChecks.filter((c) => c.status === 'pass').length;
  const warnings = tableChecks.filter((c) => c.status === 'warning').length;
  const failed = tableChecks.filter((c) => c.status === 'fail').length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${tableChecks.length}\n`);

  // Detailed results table
  console.log('Table'.padEnd(35) + 'Expected'.padEnd(12) + 'Actual'.padEnd(10) + 'Status');
  console.log('-'.repeat(70));
  tableChecks.forEach((check) => {
    const statusIcon =
      check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
    const statusText = check.status.toUpperCase();
    console.log(
      check.table.padEnd(35) +
        `≥${check.expectedMin}`.padEnd(12) +
        check.actual.toString().padEnd(10) +
        `${statusIcon} ${statusText}`
    );
  });

  // Show errors and warnings
  if (warnings > 0 || failed > 0) {
    console.log('\n');

    if (warnings > 0) {
      console.log('⚠️  WARNINGS (below expected minimum):\n');
      tableChecks
        .filter((c) => c.status === 'warning')
        .forEach((check) => {
          console.log(
            `  ${check.table}: Expected ≥${check.expectedMin}, Found ${check.actual}`
          );
        });
      console.log('');
    }

    if (failed > 0) {
      console.log('❌ FAILED CHECKS:\n');
      tableChecks
        .filter((c) => c.status === 'fail')
        .forEach((check) => {
          console.log(`  ${check.table}`);
          if (check.error) {
            console.log(`    Error: ${check.error}`);
          } else {
            console.log(
              `    Expected ≥${check.expectedMin}, Found ${check.actual}`
            );
          }
        });
      console.log('');
    }
  }

  // Additional verification: Check for required columns/data structure
  console.log('\n3️⃣ Verifying data structure...\n');
  try {
    // Check macroinvertebrate_hatches structure
    const { data: hatches, error: hatchesError } = await supabase
      .from('macroinvertebrate_hatches')
      .select('id, name, peak_month, water_types')
      .limit(1);

    if (hatchesError) {
      console.log(`⚠️  Could not verify macroinvertebrate_hatches structure: ${hatchesError.message}`);
    } else if (hatches && hatches.length > 0) {
      console.log('✅ macroinvertebrate_hatches structure verified');
    }

    // Check fly_fishing_experts structure
    const { data: experts, error: expertsError } = await supabase
      .from('fly_fishing_experts')
      .select('id, name, type, location')
      .limit(1);

    if (expertsError) {
      console.log(`⚠️  Could not verify fly_fishing_experts structure: ${expertsError.message}`);
    } else if (experts && experts.length > 0) {
      console.log('✅ fly_fishing_experts structure verified');
    }

    // Check fly_fishing_shops structure
    const { data: shops, error: shopsError } = await supabase
      .from('fly_fishing_shops')
      .select('id, name, latitude, longitude')
      .limit(1);

    if (shopsError) {
      console.log(`⚠️  Could not verify fly_fishing_shops structure: ${shopsError.message}`);
    } else if (shops && shops.length > 0) {
      console.log('✅ fly_fishing_shops structure verified');
    }
  } catch (error) {
    console.log(`⚠️  Structure verification error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Exit with appropriate code
  if (failed > 0) {
    console.log('\n❌ Database verification failed. Please review the errors above.\n');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\n⚠️  Database verification completed with warnings. Review above.\n');
    process.exit(0);
  } else {
    console.log('\n✅ Database verification passed!\n');
    process.exit(0);
  }
}

// Run verification
runVerification().catch((error) => {
  console.error('Fatal error during verification:', error);
  process.exit(1);
});

