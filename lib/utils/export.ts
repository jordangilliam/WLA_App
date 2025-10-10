/**
 * Utility functions for exporting user data
 */

import type { Progress } from '../types/lesson.types';
import type { ProgressExport, JournalExport } from '../types/export.types';

/**
 * Format progress data for export
 */
export function formatProgressForExport(
  progress: Record<string, Progress>,
  userId: string,
  userName: string,
  userEmail: string,
  track: string
): ProgressExport {
  const progressArray = Object.values(progress);
  const completed = progressArray.filter((p) => p.completed).length;
  const quizScores: Record<string, number> = {};
  
  progressArray.forEach((p) => {
    if (p.quizScore !== undefined) {
      quizScores[p.lessonId] = p.quizScore;
    }
  });

  const totalPoints = progressArray.reduce((sum, p) => sum + (p.pointsEarned || 0), 0);
  
  const lastActiveTimestamp = Math.max(
    ...progressArray.map((p) => new Date(p.lastViewed || p.startedAt).getTime())
  );

  return {
    userId,
    userName,
    email: userEmail,
    track,
    lessonsCompleted: completed,
    totalLessons: progressArray.length,
    quizScores,
    pointsEarned: totalPoints,
    journalEntries: 0, // Will be populated separately
    lastActive: new Date(lastActiveTimestamp).toISOString(),
    exportDate: new Date().toISOString(),
  };
}

/**
 * Format journal entries for export
 */
export function formatJournalForExport(
  entries: Array<{ text: string; photo?: string; date?: string }>,
  userId: string,
  userName: string
): JournalExport {
  return {
    userId,
    userName,
    entries: entries.map((entry, idx) => ({
      date: entry.date || new Date().toISOString(),
      text: entry.text,
      hasPhoto: !!entry.photo,
    })),
    exportDate: new Date().toISOString(),
  };
}

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(value ?? '');
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    ),
  ];

  return csvRows.join('\n');
}

/**
 * Convert progress data to flat format for CSV/Sheets
 */
export function flattenProgressData(progressExport: ProgressExport): Record<string, any> {
  const { quizScores, ...rest } = progressExport;
  
  return {
    ...rest,
    averageQuizScore: Object.values(quizScores).reduce((a, b) => a + b, 0) / Object.values(quizScores).length || 0,
    quizzesTaken: Object.keys(quizScores).length,
  };
}

/**
 * Download data as file (local export)
 */
export function downloadAsFile(content: string, fileName: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate export filename with timestamp
 */
export function generateExportFileName(prefix: string, extension: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  return `${prefix}_${timestamp}.${extension}`;
}

/**
 * Validate export configuration
 */
export function validateExportConfig(config: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.format) {
    errors.push('Export format is required');
  }

  if (!config.destination) {
    errors.push('Export destination is required');
  }

  if (config.destination === 'katie-cassidy' && !config.email) {
    errors.push('Katie Cassidy email is required for auto-export');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format email body for Katie Cassidy export
 */
export function formatKatieExportEmail(
  userName: string,
  progressExport: ProgressExport,
  journalExport?: JournalExport
): string {
  const avgScore = Object.values(progressExport.quizScores).reduce((a, b) => a + b, 0) / Object.values(progressExport.quizScores).length || 0;

  return `
WLA Ambassador Progress Report
==============================

Student: ${userName} (${progressExport.email})
Track: ${progressExport.track}
Export Date: ${new Date().toLocaleDateString()}

PROGRESS SUMMARY
----------------
Lessons Completed: ${progressExport.lessonsCompleted} / ${progressExport.totalLessons}
Completion Rate: ${((progressExport.lessonsCompleted / progressExport.totalLessons) * 100).toFixed(1)}%
Average Quiz Score: ${avgScore.toFixed(1)}%
Total Points Earned: ${progressExport.pointsEarned}
Journal Entries: ${journalExport?.entries.length || 0}
Last Active: ${new Date(progressExport.lastActive).toLocaleDateString()}

QUIZ SCORES BY LESSON
---------------------
${Object.entries(progressExport.quizScores)
  .map(([lessonId, score]) => `${lessonId}: ${score}%`)
  .join('\n')}

${journalExport ? `
JOURNAL HIGHLIGHTS
------------------
Total Entries: ${journalExport.entries.length}
Entries with Photos: ${journalExport.entries.filter((e) => e.hasPhoto).length}
` : ''}

---
This report was automatically generated by the WLA Ambassador Learning Platform.
For questions, please contact the student directly.
  `.trim();
}

