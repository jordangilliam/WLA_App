/**
 * React hook for exporting user data to various destinations
 */

import { useState } from 'react';
import { useProgress } from './useProgress';
import type { ExportDestination, ExportFormat, ExportResult } from '../types/export.types';
import { formatProgressForExport, formatJournalForExport, downloadAsFile, generateExportFileName } from '../utils/export';

export function useExport() {
  const { progress } = useProgress();
  const [exporting, setExporting] = useState(false);
  const [lastExport, setLastExport] = useState<ExportResult | null>(null);

  /**
   * Export data to specified destination
   */
  const exportData = async (
    destination: ExportDestination,
    options: {
      format?: ExportFormat;
      includeJournal?: boolean;
      userName?: string;
      userEmail?: string;
      track?: string;
    } = {}
  ): Promise<ExportResult> => {
    setExporting(true);

    try {
      // Get user info (in production, would come from session/profile)
      const userName = options.userName || 'WLA Ambassador';
      const userEmail = options.userEmail || 'ambassador@example.com';
      const track = options.track || 'Bucktails';

      // Format progress data
      const progressData = formatProgressForExport(
        progress,
        'user-id',
        userName,
        userEmail,
        track
      );

      // Get journal data if requested
      let journalData = null;
      if (options.includeJournal) {
        const storedEntries = localStorage.getItem('journal_entries');
        const entries = storedEntries ? JSON.parse(storedEntries) : [];
        journalData = formatJournalForExport(entries, 'user-id', userName);
      }

      let result: ExportResult;

      switch (destination) {
        case 'local':
          result = await exportToLocal(progressData, journalData, options.format || 'csv');
          break;

        case 'google-sheets':
          result = await exportToGoogleSheets(progressData, journalData);
          break;

        case 'onedrive':
          result = await exportToOneDrive(progressData, journalData, options.format || 'csv');
          break;

        case 'katie-cassidy':
          result = await exportToKatie(progressData, journalData, userName, userEmail);
          break;

        default:
          throw new Error(`Unsupported destination: ${destination}`);
      }

      setLastExport(result);
      return result;

    } catch (error: any) {
      const errorResult: ExportResult = {
        success: false,
        destination,
        error: error.message || 'Export failed',
        timestamp: new Date().toISOString(),
      };
      setLastExport(errorResult);
      return errorResult;
    } finally {
      setExporting(false);
    }
  };

  /**
   * Export to local file (download)
   */
  const exportToLocal = async (
    progressData: any,
    journalData: any,
    format: ExportFormat
  ): Promise<ExportResult> => {
    const response = await fetch('/api/export/local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progressData, journalData, format }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Local export failed');
    }

    // Get filename from headers
    const contentDisposition = response.headers.get('Content-Disposition');
    const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
    const fileName = fileNameMatch ? fileNameMatch[1] : generateExportFileName('WLA_Progress', format);

    // Download file
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
      success: true,
      destination: 'local',
      fileName,
      timestamp: new Date().toISOString(),
    };
  };

  /**
   * Export to Google Sheets
   */
  const exportToGoogleSheets = async (
    progressData: any,
    journalData: any
  ): Promise<ExportResult> => {
    const response = await fetch('/api/export/google-sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        progressData,
        journalData,
        sheetName: 'WLA Progress',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Google Sheets export failed');
    }

    return {
      success: true,
      destination: 'google-sheets',
      url: data.url,
      fileId: data.spreadsheetId,
      timestamp: data.timestamp,
    };
  };

  /**
   * Export to OneDrive
   */
  const exportToOneDrive = async (
    progressData: any,
    journalData: any,
    format: ExportFormat
  ): Promise<ExportResult> => {
    // Prepare file content
    const fileContent = JSON.stringify({ progressData, journalData }, null, 2);
    const fileName = generateExportFileName('WLA_Progress', format);

    const response = await fetch('/api/export/onedrive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileContent,
        fileName,
        format,
        folderPath: '/WLA Ambassador Data',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'OneDrive export failed');
    }

    return {
      success: true,
      destination: 'onedrive',
      url: data.url,
      fileId: data.fileId,
      fileName: data.fileName,
      timestamp: data.timestamp,
    };
  };

  /**
   * Export to Katie Cassidy
   */
  const exportToKatie = async (
    progressData: any,
    journalData: any,
    userName: string,
    userEmail: string
  ): Promise<ExportResult> => {
    const response = await fetch('/api/export/katie-cassidy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName,
        userEmail,
        progressData,
        journalData,
        subject: `WLA Ambassador Progress Report - ${userName}`,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Katie Cassidy export failed');
    }

    return {
      success: true,
      destination: 'katie-cassidy',
      timestamp: data.timestamp,
    };
  };

  return {
    exportData,
    exporting,
    lastExport,
  };
}

