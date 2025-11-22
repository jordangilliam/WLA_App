#!/usr/bin/env tsx
/**
 * Integration Test Suite
 * Tests complete workflows and data integration
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface TestResult {
  test: string;
  status: 'pass' | 'fail';
  error?: string;
  details?: any;
}

const results: TestResult[] = [];

/**
 * Test Waterway + Hatch Integration
 */
async function testWaterwayHatchIntegration(): Promise<TestResult> {
  try {
    // Get a waterway
    const { data: waterways, error: waterwayError } = await supabase
      .from('field_sites')
      .select('id, name, site_type')
      .eq('site_type', 'waterway')
      .limit(1);

    if (waterwayError || !waterways || waterways.length === 0) {
      return {
        test: 'Waterway + Hatch Integration',
        status: 'fail',
        error: 'No waterways found in database',
      };
    }

    const waterway = waterways[0];

    // Test API endpoint
    const response = await fetch(
      `${API_BASE}/waterways/hatches?waterwayId=${waterway.id}`
    );
    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        test: 'Waterway + Hatch Integration',
        status: 'fail',
        error: 'API endpoint failed',
        details: data,
      };
    }

    // Verify associated hatches
    const { data: hatches, error: hatchError } = await supabase
      .from('waterway_hatches')
      .select('*, hatch:macroinvertebrate_hatches(*)')
      .eq('field_site_id', waterway.id)
      .limit(5);

    if (hatchError) {
      return {
        test: 'Waterway + Hatch Integration',
        status: 'fail',
        error: 'Failed to query hatches',
        details: hatchError.message,
      };
    }

    // Check seasonal data
    const { data: seasonalData, error: seasonalError } = await supabase
      .from('waterway_hatches')
      .select('*, hatch:macroinvertebrate_hatches(peak_month)')
      .eq('field_site_id', waterway.id)
      .limit(1);

    if (seasonalError) {
      return {
        test: 'Waterway + Hatch Integration',
        status: 'fail',
        error: 'Failed to query seasonal data',
        details: seasonalError.message,
      };
    }

    return {
      test: 'Waterway + Hatch Integration',
      status: 'pass',
      details: {
        waterway: waterway.name,
        hatchesFound: hatches?.length || 0,
        apiResponse: data.count,
      },
    };
  } catch (error) {
    return {
      test: 'Waterway + Hatch Integration',
      status: 'fail',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test Expert Knowledge Integration
 */
async function testExpertKnowledgeIntegration(): Promise<TestResult> {
  try {
    // Get an expert
    const { data: experts, error: expertError } = await supabase
      .from('fly_fishing_experts')
      .select('id, name, type, location')
      .limit(1);

    if (expertError || !experts || experts.length === 0) {
      return {
        test: 'Expert Knowledge Integration',
        status: 'fail',
        error: 'No experts found in database',
      };
    }

    const expert = experts[0];

    // Test techniques API
    const techniquesResponse = await fetch(
      `${API_BASE}/experts/techniques?expertId=${expert.id}`
    );
    const techniquesData = await techniquesResponse.json();

    if (!techniquesResponse.ok || !techniquesData.success) {
      return {
        test: 'Expert Knowledge Integration',
        status: 'fail',
        error: 'Techniques API failed',
        details: techniquesData,
      };
    }

    // Test patterns API
    const patternsResponse = await fetch(
      `${API_BASE}/experts/patterns?expertId=${expert.id}`
    );
    const patternsData = await patternsResponse.json();

    if (!patternsResponse.ok || !patternsData.success) {
      return {
        test: 'Expert Knowledge Integration',
        status: 'fail',
        error: 'Patterns API failed',
        details: patternsData,
      };
    }

    // Verify database relationships
    const { data: techniques, error: techniquesError } = await supabase
      .from('expert_techniques')
      .select('*')
      .eq('expert_id', expert.id)
      .limit(5);

    if (techniquesError) {
      return {
        test: 'Expert Knowledge Integration',
        status: 'fail',
        error: 'Failed to query techniques',
        details: techniquesError.message,
      };
    }

    const { data: patterns, error: patternsError } = await supabase
      .from('expert_patterns')
      .select('*')
      .eq('expert_id', expert.id)
      .limit(5);

    if (patternsError) {
      return {
        test: 'Expert Knowledge Integration',
        status: 'fail',
        error: 'Failed to query patterns',
        details: patternsError.message,
      };
    }

    return {
      test: 'Expert Knowledge Integration',
      status: 'pass',
      details: {
        expert: expert.name,
        techniquesFound: techniques?.length || 0,
        patternsFound: patterns?.length || 0,
        apiTechniques: techniquesData.count,
        apiPatterns: patternsData.count,
      },
    };
  } catch (error) {
    return {
      test: 'Expert Knowledge Integration',
      status: 'fail',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test Fly Shop Search
 */
async function testFlyShopSearch(): Promise<TestResult> {
  try {
    // Test nearby search (Pittsburgh coordinates)
    const nearbyResponse = await fetch(
      `${API_BASE}/shops/nearby?lat=40.4406&lng=-79.9959&radius=50`
    );
    const nearbyData = await nearbyResponse.json();

    if (!nearbyResponse.ok || !nearbyData.success) {
      return {
        test: 'Fly Shop Search',
        status: 'fail',
        error: 'Nearby search API failed',
        details: nearbyData,
      };
    }

    // Verify location data
    if (nearbyData.data && nearbyData.data.length > 0) {
      const shop = nearbyData.data[0];
      if (!shop.latitude || !shop.longitude) {
        return {
          test: 'Fly Shop Search',
          status: 'fail',
          error: 'Shop missing location data',
          details: shop,
        };
      }
    }

    // Test filtering
    const filteredResponse = await fetch(
      `${API_BASE}/shops/all?region=Southwest&hasGuides=true`
    );
    const filteredData = await filteredResponse.json();

    if (!filteredResponse.ok || !filteredData.success) {
      return {
        test: 'Fly Shop Search',
        status: 'fail',
        error: 'Filtered search API failed',
        details: filteredData,
      };
    }

    // Test all shops endpoint
    const allResponse = await fetch(`${API_BASE}/shops/all`);
    const allData = await allResponse.json();

    if (!allResponse.ok || !allData.success) {
      return {
        test: 'Fly Shop Search',
        status: 'fail',
        error: 'All shops API failed',
        details: allData,
      };
    }

    return {
      test: 'Fly Shop Search',
      status: 'pass',
      details: {
        nearbyShops: nearbyData.count,
        filteredShops: filteredData.count,
        totalShops: allData.count,
      },
    };
  } catch (error) {
    return {
      test: 'Fly Shop Search',
      status: 'fail',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test PFBC Data Integration
 */
async function testPFBCDataIntegration(): Promise<TestResult> {
  try {
    // Test mapping layers
    const mappingResponse = await fetch(`${API_BASE}/pfbc/mapping-layers`);
    const mappingData = await mappingResponse.json();

    if (!mappingResponse.ok || !mappingData.success) {
      return {
        test: 'PFBC Data Integration',
        status: 'fail',
        error: 'Mapping layers API failed',
        details: mappingData,
      };
    }

    // Verify layer structure
    if (!mappingData.layers && !mappingData.data) {
      return {
        test: 'PFBC Data Integration',
        status: 'fail',
        error: 'Invalid mapping layers response structure',
        details: mappingData,
      };
    }

    // Test stocking schedules
    const stockingResponse = await fetch(`${API_BASE}/pfbc/stocking`);
    const stockingData = await stockingResponse.json();

    if (!stockingResponse.ok || !stockingData.success) {
      return {
        test: 'PFBC Data Integration',
        status: 'fail',
        error: 'Stocking schedules API failed',
        details: stockingData,
      };
    }

    // Test access points
    const accessResponse = await fetch(`${API_BASE}/pfbc/access-points`);
    const accessData = await accessResponse.json();

    if (!accessResponse.ok || !accessData.success) {
      return {
        test: 'PFBC Data Integration',
        status: 'fail',
        error: 'Access points API failed',
        details: accessData,
      };
    }

    // Verify geospatial data in database
    const { data: troutStreams, error: troutError } = await supabase
      .from('pfbc_trout_streams')
      .select('id, name, geometry')
      .limit(1);

    if (troutError) {
      return {
        test: 'PFBC Data Integration',
        status: 'fail',
        error: 'Failed to query trout streams',
        details: troutError.message,
      };
    }

    const { data: accessPoints, error: accessError } = await supabase
      .from('pfbc_access_points')
      .select('id, name, latitude, longitude')
      .limit(1);

    if (accessError) {
      return {
        test: 'PFBC Data Integration',
        status: 'fail',
        error: 'Failed to query access points',
        details: accessError.message,
      };
    }

    return {
      test: 'PFBC Data Integration',
      status: 'pass',
      details: {
        mappingLayers: mappingData.layers ? Object.keys(mappingData.layers).length : mappingData.count,
        stockingSchedules: stockingData.count,
        accessPoints: accessData.count,
        troutStreamsInDB: troutStreams?.length || 0,
        accessPointsInDB: accessPoints?.length || 0,
      },
    };
  } catch (error) {
    return {
      test: 'PFBC Data Integration',
      status: 'fail',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Run all integration tests
 */
async function runIntegrationTests() {
  console.log('🧪 Running Integration Tests\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  console.log('1️⃣ Testing Waterway + Hatch Integration...');
  results.push(await testWaterwayHatchIntegration());

  console.log('2️⃣ Testing Expert Knowledge Integration...');
  results.push(await testExpertKnowledgeIntegration());

  console.log('3️⃣ Testing Fly Shop Search...');
  results.push(await testFlyShopSearch());

  console.log('4️⃣ Testing PFBC Data Integration...');
  results.push(await testPFBCDataIntegration());

  // Print results
  console.log('\n' + '='.repeat(70));
  console.log('📊 INTEGRATION TEST RESULTS');
  console.log('='.repeat(70) + '\n');

  const passed = results.filter((r) => r.status === 'pass').length;
  const failed = results.filter((r) => r.status === 'fail').length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${results.length}\n`);

  // Detailed results
  results.forEach((result) => {
    const icon = result.status === 'pass' ? '✅' : '❌';
    console.log(`${icon} ${result.test}`);
    if (result.details) {
      Object.entries(result.details).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  });

  // Exit with appropriate code
  if (failed > 0) {
    console.log('❌ Some integration tests failed. Please review the errors above.\n');
    process.exit(1);
  } else {
    console.log('✅ All integration tests passed!\n');
    process.exit(0);
  }
}

// Run tests
runIntegrationTests().catch((error) => {
  console.error('Fatal error running integration tests:', error);
  process.exit(1);
});

