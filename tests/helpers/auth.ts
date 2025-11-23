import { Page } from '@playwright/test';
import { TEST_USERS } from '../fixtures/test-users';

/**
 * Authentication helpers for E2E tests
 * Note: WLA uses NextAuth with OAuth providers (Google/Microsoft)
 * For testing, we'll skip authentication or use mock auth
 */

export async function loginAsStudent(page: Page): Promise<void> {
  // WLA uses OAuth, so we'll skip actual login for now
  // In a real scenario, you'd need to mock the OAuth flow or use test credentials
  // For now, we'll just navigate and check if auth is required
  await page.goto('/dashboard/student');
  
  // If redirected to auth, that's expected - tests should handle unauthenticated state
  const currentUrl = page.url();
  if (currentUrl.includes('/auth') || currentUrl.includes('/api/auth')) {
    // Auth required - tests should handle this gracefully
    return;
  }
  
  // If already authenticated, continue
  await page.waitForLoadState('networkidle');
}

export async function loginAsTeacher(page: Page): Promise<void> {
  // Same as student - OAuth-based auth
  await page.goto('/dashboard/teacher');
  const currentUrl = page.url();
  if (currentUrl.includes('/auth') || currentUrl.includes('/api/auth')) {
    return;
  }
  await page.waitForLoadState('networkidle');
}

export async function logout(page: Page): Promise<void> {
  // Try to find logout button/link
  const logoutButton = page.getByRole('button', { name: /logout|sign out/i }).or(
    page.getByRole('link', { name: /logout|sign out/i })
  );
  
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForURL(/\/auth|\/api\/auth/, { timeout: 5000 });
  }
}

export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // Check for authenticated indicators
    const userMenu = page.locator('[data-testid="user-menu"]').or(
      page.getByText(/profile|dashboard/i).first()
    );
    await userMenu.waitFor({ timeout: 2000 });
    return true;
  } catch {
    // Check if we're on auth page
    const url = page.url();
    return !url.includes('/auth') && !url.includes('/api/auth');
  }
}

/**
 * Skip authentication for tests that don't require it
 * Use this for public pages
 */
export async function skipAuth(page: Page): Promise<void> {
  // Just ensure page loads - no auth needed
  await page.waitForLoadState('networkidle');
}

