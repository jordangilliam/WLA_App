/**
 * Local Export API Route
 * 
 * This route prepares data for local download (CSV, JSON, PDF)
 * Returns data that client can download as file
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';
import { convertToCSV, flattenProgressData } from '@/lib/utils/export';
import type { ProgressExport, JournalExport, ExportFormat } from '@/lib/types/export.types';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      progressData,
      journalData,
      format = 'csv',
    }: {
      progressData: ProgressExport;
      journalData?: JournalExport;
      format?: ExportFormat;
    } = body;

    // Validate data
    if (!progressData) {
      return NextResponse.json(
        { error: 'Progress data is required' },
        { status: 400 }
      );
    }

    let content: string;
    let mimeType: string;
    let fileName: string;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];

    switch (format) {
      case 'csv':
        {
          // Flatten progress data for CSV
          const flatProgress = flattenProgressData(progressData);
          const progressRows = [flatProgress];
          
          // Add journal entries if included
          let csvContent = convertToCSV(progressRows);
          
          if (journalData?.entries && journalData.entries.length > 0) {
            csvContent += '\n\n' + convertToCSV(journalData.entries);
          }

          content = csvContent;
          mimeType = 'text/csv';
          fileName = `WLA_Progress_${timestamp}.csv`;
        }
        break;

      case 'json':
        {
          const jsonData = {
            progress: progressData,
            journal: journalData,
            exportDate: new Date().toISOString(),
          };
          
          content = JSON.stringify(jsonData, null, 2);
          mimeType = 'application/json';
          fileName = `WLA_Progress_${timestamp}.json`;
        }
        break;

      case 'pdf':
        {
          // PDF generation would require a library like jsPDF or Puppeteer
          // For now, return a message that this needs to be implemented
          return NextResponse.json({
            error: 'PDF export requires additional implementation',
            message: 'PDF generation would use jsPDF or similar library',
          }, { status: 501 });
        }

      default:
        return NextResponse.json(
          { error: `Unsupported format: ${format}` },
          { status: 400 }
        );
    }

    // Return the data with appropriate headers
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error: any) {
    console.error('Local export error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to prepare export',
      },
      { status: 500 }
    );
  }
}

