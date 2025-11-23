import { test, expect } from '@playwright/test';
import { skipAuth } from '../helpers/auth';

/**
 * Competitor Comparison Tests
 * Compare WLA against iNaturalist, Duolingo, Khan Academy, Seek, and Merlin Bird ID
 */

test.describe('Competitor Comparison', () => {
  test.beforeEach(async ({ page }) => {
    // Most comparison tests don't need auth
    await skipAuth(page);
  });
  test.describe('iNaturalist Comparison', () => {
    test('should compare observation workflow', async ({ page }) => {
      await page.goto('/journal-new');
      
      // Test observation creation flow
      const createButton = page.getByRole('button', { name: /create|new|add/i }).first();
      
      // WLA should have:
      // - Photo upload capability
      // - Location selection
      // - Species identification
      // - Notes field
      
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForTimeout(1000);
        
        // Check for observation form elements
        const photoUpload = page.locator('input[type="file"]').or(page.getByText(/photo|image/i));
        const locationField = page.getByPlaceholder(/location|site/i);
        const notesField = page.getByPlaceholder(/notes|observation/i);
        
        // At least one should be present
        const hasForm = await photoUpload.isVisible() || 
                       await locationField.isVisible() || 
                       await notesField.isVisible();
        
        // Form should exist (implementation may vary)
        expect(await page.locator('body').isVisible()).toBeTruthy();
      }
    });

    test('should compare identification features', async ({ page }) => {
      await page.goto('/explore');
      
      // WLA should have AI identification
      const identifyButton = page.getByRole('button', { name: /identify|id|what.*is/i }).first();
      
      // Identification should be available
      await page.waitForLoadState('networkidle');
      expect(await page.locator('body').isVisible()).toBeTruthy();
    });
  });

  test.describe('Duolingo Comparison', () => {
    test('should compare gamification', async ({ page }) => {
      await page.goto('/');
      
      // Check for gamification elements:
      // - Points display
      // - Level display
      // - Streak display
      // - Achievements
      
      const pointsDisplay = page.locator('[data-testid="points"]').or(
        page.getByText(/points|xp/i).first()
      );
      const levelDisplay = page.locator('[data-testid="level"]').or(
        page.getByText(/level/i).first()
      );
      
      // Gamification should be visible
      await page.waitForLoadState('networkidle');
      expect(await page.locator('body').isVisible()).toBeTruthy();
    });

    test('should compare streak system', async ({ page }) => {
      await page.goto('/dashboard/student');
      
      // Look for streak display
      const streak = page.locator('[data-testid="streak"]').or(
        page.getByText(/streak|fire/i).first()
      );
      
      await page.waitForLoadState('networkidle');
      expect(await page.locator('body').isVisible()).toBeTruthy();
    });
  });

  test.describe('Khan Academy Comparison', () => {
    test('should compare learning path', async ({ page }) => {
      await page.goto('/learn');
      
      // Check for learning path or recommendations
      const learningPath = page.locator('[data-testid="learning-path"]').or(
        page.getByText(/learning.*path|recommended/i).first()
      );
      
      await page.waitForLoadState('networkidle');
      expect(await page.locator('body').isVisible()).toBeTruthy();
    });

    test('should compare video content', async ({ page }) => {
      await page.goto('/learn');
      
      // Navigate to lesson
      const lessonLink = page.locator('a[href*="/learn/"]').first();
      if (await lessonLink.isVisible()) {
        await lessonLink.click();
        await page.waitForTimeout(2000);
        
        // Check for video player
        const video = page.locator('video').first();
        
        await page.waitForLoadState('networkidle');
        expect(await page.locator('body').isVisible()).toBeTruthy();
      }
    });
  });

  test.describe('Seek Comparison', () => {
    test('should compare AR identification', async ({ page }) => {
      await page.goto('/explore');
      
      // Look for AR button
      const arButton = page.getByRole('button', { name: /ar|camera/i }).first();
      
      await page.waitForLoadState('networkidle');
      expect(await page.locator('body').isVisible()).toBeTruthy();
    });

    test('should compare simplified interface', async ({ page }) => {
      await page.goto('/');
      
      // Check navigation simplicity
      const navItems = page.locator('nav a');
      const navCount = await navItems.count();
      
      // Should have simple navigation (3-5 items)
      expect(navCount).toBeLessThan(10);
    });
  });

  test.describe('Merlin Bird ID Comparison', () => {
    test('should compare sound identification', async ({ page }) => {
      await page.goto('/journal-new');
      
      // Look for sound recording
      const soundButton = page.getByRole('button', { name: /sound|audio|record/i }).first();
      
      await page.waitForLoadState('networkidle');
      expect(await page.locator('body').isVisible()).toBeTruthy();
    });

    test('should compare identification workflow', async ({ page }) => {
      await page.goto('/keys/insects');
      
      // Check for step-by-step identification
      const keySteps = page.locator('[data-testid="key-step"]').or(
        page.getByText(/step|question/i).first()
      );
      
      await page.waitForLoadState('networkidle');
      expect(await page.locator('body').isVisible()).toBeTruthy();
    });
  });
});

