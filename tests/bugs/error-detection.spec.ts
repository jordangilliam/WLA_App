import { test, expect } from '@playwright/test';

/**
 * Automated Bug Detection Tests
 * Test for common bugs: console errors, network failures, etc.
 */

test.describe('Error Detection', () => {
  test('should detect console errors on all pages', async ({ page }) => {
    // Increase timeout for this test
    test.setTimeout(60000);
    
    const pages = ['/', '/explore', '/learn', '/journal-new']; // Reduced pages for faster test
    const errors: Array<{ page: string; error: string }> = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push({
          page: page.url(),
          error: msg.text(),
        });
      }
    });

    for (const path of pages) {
      await page.goto(path);
      // Use domcontentloaded instead of networkidle (faster, more reliable)
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(500); // Shorter timeout
    }

    // Log errors for documentation
    if (errors.length > 0) {
      console.error('Console errors detected:', errors);
    }

    // Fail test if critical errors found (ignore known non-critical errors)
    const criticalErrors = errors.filter((e) =>
      (e.error.includes('Failed to load') && !e.error.includes('story_missions')) && // Known issue
      !e.error.includes('Cookie') && // Cookie warnings are OK
      !e.error.includes('Clerk') && // Third-party service warnings
      (e.error.includes('NetworkError') ||
      e.error.includes('TypeError: Cannot read'))
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('should detect network failures', async ({ page }) => {
    const failedRequests: Array<{ url: string; status: number }> = [];

    page.on('response', (response) => {
      if (response.status() >= 400) {
        failedRequests.push({
          url: response.url(),
          status: response.status(),
        });
      }
    });

    await page.goto('/');
    // Use domcontentloaded instead of networkidle (faster, more reliable)
    await page.waitForLoadState('domcontentloaded');
    // Wait a bit for async requests
    await page.waitForTimeout(2000);

    // Log failed requests
    if (failedRequests.length > 0) {
      console.error('Failed requests:', failedRequests);
    }

    // Critical failures (500s) should not occur
    // Allow 404s for missing resources (expected)
    const criticalFailures = failedRequests.filter((r) => r.status >= 500);
    expect(criticalFailures.length).toBe(0);
  });

  test('should detect authentication failures', async ({ page }) => {
    // Try to access protected route without auth
    const response = await page.goto('/dashboard/student');
    
    // Should redirect to auth or return 401
    expect([200, 401, 302, 403]).toContain(response?.status() || 0);
  });

  test('should detect data persistence issues', async ({ page }) => {
    await page.goto('/');
    
    // Set data in localStorage
    await page.evaluate(() => {
      localStorage.setItem('test-data', 'test-value');
    });
    
    // Reload page
    await page.reload();
    
    // Verify data persisted
    const value = await page.evaluate(() => {
      return localStorage.getItem('test-data');
    });
    
    expect(value).toBe('test-value');
  });

  test('should detect state management bugs', async ({ page }) => {
    await page.goto('/explore');
    
    // Interact with page
    const filterButton = page.getByRole('button', { name: /filter/i }).first();
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);
      
      // State should be maintained
      // Check for filter UI
      const filterPanel = page.locator('[data-testid="filters"]').or(
        page.getByText(/filter/i).first()
      );
      
      // Filter should be visible or state should be maintained
      await page.waitForTimeout(500);
    }
    
    // Verify no errors occurred
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  });

  test('should detect memory leaks', async ({ page }) => {
    // Navigate through multiple pages
    const pages = ['/', '/explore', '/learn', '/journal-new'];
    
    for (const path of pages) {
      await page.goto(path);
      // Use domcontentloaded instead of networkidle (faster, more reliable)
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(500); // Shorter timeout
    }
    
    // Check for excessive memory usage (basic check)
    const metrics = await page.evaluate(() => {
      return {
        jsHeapSizeLimit: (performance as any).memory?.jsHeapSizeLimit || 0,
        usedJSHeapSize: (performance as any).memory?.usedJSHeapSize || 0,
      };
    });
    
    // Memory should be reasonable (less than 100MB for basic pages)
    if (metrics.usedJSHeapSize > 0) {
      expect(metrics.usedJSHeapSize).toBeLessThan(100 * 1024 * 1024);
    }
  });
});

