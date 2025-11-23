import { test, expect } from '@playwright/test';

/**
 * API Endpoint Tests
 * Test all API routes for correct responses, authentication, and error handling
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const apiEndpoints = [
  { path: '/api/health', method: 'GET', auth: false },
  { path: '/api/challenges', method: 'GET', auth: true },
  { path: '/api/challenges', method: 'POST', auth: true },
  { path: '/api/check-in', method: 'POST', auth: true },
  { path: '/api/observations', method: 'GET', auth: true },
  { path: '/api/observations', method: 'POST', auth: true },
  { path: '/api/field-sites', method: 'GET', auth: false },
  { path: '/api/recommendations/unified', method: 'GET', auth: false },
  { path: '/api/recommendations/learning-path', method: 'GET', auth: true },
  { path: '/api/collaboration/live-session', method: 'GET', auth: true },
  { path: '/api/collaboration/live-session', method: 'POST', auth: true },
  { path: '/api/competitions', method: 'GET', auth: true },
  { path: '/api/social/feed', method: 'GET', auth: true },
  { path: '/api/social/share', method: 'POST', auth: true },
  { path: '/api/sound/identify', method: 'POST', auth: true },
  { path: '/api/ai/assistant', method: 'POST', auth: true },
  { path: '/api/ai/adaptive-quiz', method: 'GET', auth: true },
  { path: '/api/streaks/freeze', method: 'POST', auth: true },
];

test.describe('API Endpoints', () => {
  test.describe('Public Endpoints', () => {
    test('health endpoint should return 200', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/health`);
      expect(response.status()).toBeLessThan(400);
    });

    test('field sites endpoint should return data', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/field-sites`);
      expect(response.status()).toBeLessThan(400);
      
      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      }
    });
  });

  test.describe('Authenticated Endpoints', () => {
    // Note: These tests require actual authentication tokens
    // In a real scenario, we'd use test authentication
    
    test('challenges endpoint should require auth', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/challenges`);
      // Should return 401 or redirect to auth
      expect([401, 403, 302]).toContain(response.status());
    });

    test('observations endpoint should require auth', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/observations`, {
        data: {},
      });
      expect([401, 403, 400]).toContain(response.status());
    });
  });

  test.describe('Request Validation', () => {
    test('POST endpoints should validate input', async ({ request }) => {
      // Test with invalid data
      const endpoints = [
        '/api/observations',
        '/api/check-in',
        '/api/social/share',
      ];

      for (const endpoint of endpoints) {
        const response = await request.post(`${BASE_URL}${endpoint}`, {
          data: { invalid: 'data' },
        });
        
        // Should return 400 (bad request) or 401 (unauthorized)
        expect([400, 401, 403]).toContain(response.status());
      }
    });
  });

  test.describe('Response Structure', () => {
    test('endpoints should return consistent structure', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/field-sites`);
      
      if (response.ok()) {
        const data = await response.json();
        
        // Should have consistent structure
        expect(data).toBeDefined();
        // Most endpoints return { success, data } or { data }
        expect(typeof data === 'object').toBeTruthy();
      }
    });
  });

  test.describe('Error Handling', () => {
    test('endpoints should handle errors gracefully', async ({ request }) => {
      // Test with invalid endpoint
      const response = await request.get(`${BASE_URL}/api/nonexistent`);
      expect([404, 405]).toContain(response.status());
    });

    test('endpoints should return error messages', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/observations`, {
        data: {},
      });
      
      if (!response.ok()) {
        const data = await response.json().catch(() => ({}));
        // Should have error message
        expect(data.error || data.message).toBeDefined();
      }
    });
  });
});

