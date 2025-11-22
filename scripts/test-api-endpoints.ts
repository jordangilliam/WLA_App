#!/usr/bin/env tsx
/**
 * API Endpoint Test Script
 * Tests all new API endpoints and verifies response structure
 */

import 'dotenv/config';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

interface TestResult {
  endpoint: string;
  method: string;
  status: 'pass' | 'fail' | 'skip';
  statusCode?: number;
  responseTime?: number;
  error?: string;
  data?: any;
}

const results: TestResult[] = [];

/**
 * Test an API endpoint
 */
async function testEndpoint(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  params?: Record<string, string>
): Promise<TestResult> {
  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const startTime = Date.now();
  try {
    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseTime = Date.now() - startTime;
    const data = await response.json();

    if (!response.ok) {
      return {
        endpoint,
        method,
        status: 'fail',
        statusCode: response.status,
        responseTime,
        error: data.error || `HTTP ${response.status}`,
        data,
      };
    }

    // Verify response structure
    if (!data.success && data.success !== undefined) {
      return {
        endpoint,
        method,
        status: 'fail',
        statusCode: response.status,
        responseTime,
        error: 'Response missing success field or success is false',
        data,
      };
    }

    return {
      endpoint,
      method,
      status: 'pass',
      statusCode: response.status,
      responseTime,
      data,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      endpoint,
      method,
      status: 'fail',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Run all API endpoint tests
 */
async function runTests() {
  console.log('🧪 Testing API Endpoints\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  // Test Waterway Hatch endpoints
  console.log('1️⃣ Testing Waterway Hatch endpoints...');
  results.push(await testEndpoint('/waterways/hatches'));
  results.push(await testEndpoint('/waterways/hatches', 'GET', { waterwayId: '1' }));
  results.push(await testEndpoint('/waterways/hatches', 'GET', { month: '5' }));
  results.push(await testEndpoint('/waterways/hatches', 'GET', { waterType: 'stream' }));

  // Test Expert endpoints
  console.log('2️⃣ Testing Expert endpoints...');
  results.push(await testEndpoint('/experts/techniques'));
  results.push(await testEndpoint('/experts/techniques', 'GET', { expertId: '1' }));
  results.push(await testEndpoint('/experts/techniques', 'GET', { difficulty: 'beginner' }));
  results.push(await testEndpoint('/experts/patterns'));
  results.push(await testEndpoint('/experts/patterns', 'GET', { expertId: '1' }));
  results.push(await testEndpoint('/experts/patterns', 'GET', { patternType: 'dry-fly' }));

  // Test Fly Shop endpoints
  console.log('3️⃣ Testing Fly Shop endpoints...');
  results.push(
    await testEndpoint('/shops/nearby', 'GET', {
      lat: '40.4406',
      lng: '-79.9959',
    })
  );
  results.push(await testEndpoint('/shops/nearby', 'GET', { lat: '40.4406', lng: '-79.9959', radius: '25' }));
  results.push(await testEndpoint('/shops/all'));
  results.push(await testEndpoint('/shops/all', 'GET', { region: 'Southwest' }));

  // Test PFBC endpoints
  console.log('4️⃣ Testing PFBC endpoints...');
  results.push(await testEndpoint('/pfbc/mapping-layers'));
  results.push(await testEndpoint('/pfbc/mapping-layers', 'GET', { layerType: 'class-a' }));
  results.push(await testEndpoint('/pfbc/mapping-layers', 'GET', { layerType: 'wild-trout' }));
  results.push(await testEndpoint('/pfbc/mapping-layers', 'GET', { layerType: 'bass' }));
  results.push(await testEndpoint('/pfbc/stocking'));
  results.push(await testEndpoint('/pfbc/stocking', 'GET', { county: 'Allegheny' }));
  results.push(await testEndpoint('/pfbc/access-points'));
  results.push(await testEndpoint('/pfbc/access-points', 'GET', { waterwayId: '1' }));
  results.push(await testEndpoint('/pfbc/regulations'));
  results.push(await testEndpoint('/pfbc/regulations', 'GET', { waterwayId: '1' }));
  results.push(await testEndpoint('/pfbc/habitat'));
  results.push(await testEndpoint('/pfbc/habitat', 'GET', { waterwayId: '1' }));

  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(60) + '\n');

  const passed = results.filter((r) => r.status === 'pass').length;
  const failed = results.filter((r) => r.status === 'fail').length;
  const skipped = results.filter((r) => r.status === 'skip').length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`📈 Total: ${results.length}\n`);

  // Detailed results
  if (failed > 0) {
    console.log('\n❌ FAILED TESTS:\n');
    results
      .filter((r) => r.status === 'fail')
      .forEach((result) => {
        console.log(`  ${result.method} ${result.endpoint}`);
        console.log(`    Status: ${result.statusCode || 'N/A'}`);
        console.log(`    Error: ${result.error}`);
        if (result.responseTime) {
          console.log(`    Time: ${result.responseTime}ms`);
        }
        console.log('');
      });
  }

  // Summary table
  console.log('\n📋 DETAILED RESULTS:\n');
  console.log('Endpoint'.padEnd(40) + 'Status'.padEnd(10) + 'Code'.padEnd(8) + 'Time');
  console.log('-'.repeat(70));
  results.forEach((result) => {
    const statusIcon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⏭️';
    const statusText = result.status.toUpperCase().padEnd(8);
    const code = (result.statusCode?.toString() || 'N/A').padEnd(6);
    const time = result.responseTime ? `${result.responseTime}ms` : 'N/A';
    console.log(
      `${result.method} ${result.endpoint}`.padEnd(40) +
        `${statusIcon} ${statusText}`.padEnd(10) +
        code.padEnd(8) +
        time
    );
  });

  // Exit with appropriate code
  if (failed > 0) {
    console.log('\n❌ Some tests failed. Please review the errors above.\n');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!\n');
    process.exit(0);
  }
}

// Run tests
runTests().catch((error) => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});

