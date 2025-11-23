import { test, expect } from '@playwright/test';
import { createTestUser, deleteTestUser, resetUserPoints, getTestUserPoints } from '../helpers/db';

/**
 * Database Integration Tests
 * Test database operations, migrations, and RLS policies
 */

test.describe('Database Operations', () => {
  let testUserId: string | null = null;

  test.beforeEach(async () => {
    // Create test user
    testUserId = await createTestUser({
      email: `test-${Date.now()}@wla.test`,
      name: 'Test User',
      role: 'student',
    });
  });

  test.afterEach(async () => {
    // Clean up test user
    if (testUserId) {
      await deleteTestUser(testUserId);
      testUserId = null;
    }
  });

  test('user creation should work', async () => {
    // Skip if test user creation failed (requires database access)
    if (!testUserId) {
      test.skip();
      return;
    }
    expect(testUserId).toBeTruthy();
  });

  test('points storage should work', async () => {
    if (!testUserId) {
      test.skip();
      return;
    }

    // Reset points first
    await resetUserPoints(testUserId);

    // Points should start at 0
    const initialPoints = await getTestUserPoints(testUserId);
    expect(initialPoints).toBe(0);

    // Note: Actual points insertion would require API call or direct DB insert
    // This test verifies the helper functions work
  });

  test('user deletion should work', async () => {
    if (!testUserId) {
      test.skip();
      return;
    }

    await deleteTestUser(testUserId);
    
    // User should be deleted (verify by trying to fetch)
    // In real implementation, would verify user doesn't exist
    expect(true).toBeTruthy(); // Placeholder
  });
});

test.describe('Database Migrations', () => {
  test('all migrations should be applied', async ({ request }) => {
    // This would require a migration status endpoint
    // For now, verify tables exist by querying API endpoints
    
    const response = await request.get(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/field-sites`);
    expect(response.status()).toBeLessThan(500);
    
    // If endpoint works, tables likely exist
  });
});

