/**
 * Types for data export functionality
 */

export type ExportFormat = 'csv' | 'json' | 'pdf';

export type ExportDestination = 'local' | 'google-drive' | 'google-sheets' | 'onedrive' | 'katie-cassidy';

export interface ExportConfig {
  format: ExportFormat;
  destination: ExportDestination;
  includeProgress: boolean;
  includeJournal: boolean;
  includePoints: boolean;
  includeLessonData: boolean;
}

export interface ExportResult {
  success: boolean;
  destination: ExportDestination;
  url?: string;
  fileId?: string;
  fileName?: string;
  error?: string;
  timestamp: string;
}

export interface GoogleSheetsExportConfig extends ExportConfig {
  spreadsheetId?: string; // If updating existing sheet
  sheetName?: string; // Name of the sheet tab
  shareWithEmail?: string; // Email to share with
}

export interface OneDriveExportConfig extends ExportConfig {
  folderId?: string; // Specific folder to save to
  folderPath?: string; // Path like "/WLA Ambassador Data"
}

export interface KatieCassidyExportConfig extends ExportConfig {
  email: string; // Katie's email
  cc?: string[]; // Additional CCs
  subject?: string;
  includeAttachments: boolean;
}

// Progress data structure for export
export interface ProgressExport {
  userId: string;
  userName: string;
  email: string;
  track: string;
  lessonsCompleted: number;
  totalLessons: number;
  quizScores: Record<string, number>;
  pointsEarned: number;
  journalEntries: number;
  lastActive: string;
  exportDate: string;
}

// Journal entry structure for export
export interface JournalExport {
  userId: string;
  userName: string;
  entries: Array<{
    date: string;
    text: string;
    hasPhoto: boolean;
  }>;
  exportDate: string;
}

