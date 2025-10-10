/**
 * Katie Cassidy Auto-Export API Route
 * 
 * This route automatically sends progress reports to Katie Cassidy
 * via email with optional attachments
 * 
 * Requirements:
 * - Email service configured (SendGrid, Resend, or similar)
 * - Katie's email address configured
 * 
 * Environment Variables Needed:
 * - EMAIL_SERVICE_API_KEY (SendGrid/Resend API key)
 * - KATIE_CASSIDY_EMAIL
 * - FROM_EMAIL (sender email address)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';
import type { ProgressExport, JournalExport } from '@/lib/types/export.types';

// Katie Cassidy's email (could also come from env variable)
const KATIE_EMAIL = process.env.KATIE_CASSIDY_EMAIL || 'katie.cassidy@example.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@wla-ambassadors.org';

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
      userName,
      userEmail,
      progressData,
      journalData,
      attachments = [],
      subject = 'WLA Ambassador Progress Report',
      cc = [],
    }: {
      userName: string;
      userEmail: string;
      progressData: ProgressExport;
      journalData?: JournalExport;
      attachments?: any[];
      subject?: string;
      cc?: string[];
    } = body;

    // Validate data
    if (!userName || !userEmail || !progressData) {
      return NextResponse.json(
        { error: 'User name, email, and progress data are required' },
        { status: 400 }
      );
    }

    // Format email body
    const avgScore = Object.values(progressData.quizScores).reduce((a: number, b: number) => a + b, 0) / 
                     Object.values(progressData.quizScores).length || 0;
    
    const completionRate = ((progressData.lessonsCompleted / progressData.totalLessons) * 100).toFixed(1);

    const emailBody = `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #0077B6; border-bottom: 3px solid #0077B6; padding-bottom: 10px;">
        🌲 WLA Ambassador Progress Report
      </h2>
      
      <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #023047;">Student Information</h3>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Track:</strong> ${progressData.track}</p>
        <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="background: #E0F2FE; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #023047;">Progress Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px;"><strong>Lessons Completed:</strong></td>
            <td style="padding: 8px;">${progressData.lessonsCompleted} / ${progressData.totalLessons}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Completion Rate:</strong></td>
            <td style="padding: 8px;">${completionRate}%</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Average Quiz Score:</strong></td>
            <td style="padding: 8px;">${avgScore.toFixed(1)}%</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Total Points Earned:</strong></td>
            <td style="padding: 8px;">${progressData.pointsEarned}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Journal Entries:</strong></td>
            <td style="padding: 8px;">${journalData?.entries?.length || 0}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Last Active:</strong></td>
            <td style="padding: 8px;">${new Date(progressData.lastActive).toLocaleDateString()}</td>
          </tr>
        </table>
      </div>

      ${Object.keys(progressData.quizScores).length > 0 ? `
      <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #023047;">Quiz Scores by Lesson</h3>
        <ul style="list-style: none; padding: 0;">
          ${Object.entries(progressData.quizScores)
            .map(([lessonId, score]: [string, any]) => `
              <li style="padding: 5px 0; border-bottom: 1px solid #E5E7EB;">
                ${lessonId}: <strong>${score}%</strong>
              </li>
            `)
            .join('')}
        </ul>
      </div>
      ` : ''}

      ${journalData?.entries?.length > 0 ? `
      <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #023047;">Journal Activity</h3>
        <p><strong>Total Entries:</strong> ${journalData.entries.length}</p>
        <p><strong>Entries with Photos:</strong> ${journalData.entries.filter((e: any) => e.hasPhoto).length}</p>
      </div>
      ` : ''}

      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #E5E7EB; color: #6B7280; font-size: 0.9em;">
        <p>This report was automatically generated by the WLA Ambassador Learning Platform.</p>
        <p>For questions about this student's progress, please contact them directly at ${userEmail}.</p>
      </div>
    </div>
  </body>
</html>
    `.trim();

    /**
     * Email Service Integration
     * 
     * In production, you would integrate with an email service:
     * 
     * Option 1: SendGrid
     * ```typescript
     * import sgMail from '@sendgrid/mail';
     * 
     * sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
     * 
     * const msg = {
     *   to: KATIE_EMAIL,
     *   cc,
     *   from: FROM_EMAIL,
     *   subject,
     *   html: emailBody,
     *   attachments: attachments.map(att => ({
     *     content: att.content,
     *     filename: att.filename,
     *     type: att.type,
     *   })),
     * };
     * 
     * await sgMail.send(msg);
     * ```
     * 
     * Option 2: Resend
     * ```typescript
     * import { Resend } from 'resend';
     * 
     * const resend = new Resend(process.env.RESEND_API_KEY);
     * 
     * await resend.emails.send({
     *   from: FROM_EMAIL,
     *   to: KATIE_EMAIL,
     *   cc,
     *   subject,
     *   html: emailBody,
     *   attachments,
     * });
     * ```
     */

    // MOCK RESPONSE for development
    // In production, replace with actual email API call
    console.log('📧 Katie Cassidy Export (MOCK):', {
      to: KATIE_EMAIL,
      cc,
      from: FROM_EMAIL,
      subject,
      student: userName,
      completionRate,
      avgScore: avgScore.toFixed(1),
      attachmentsCount: attachments.length,
    });

    // Log email body to console for development/debugging
    console.log('Email Body Preview:', emailBody.substring(0, 500) + '...');

    return NextResponse.json({
      success: true,
      destination: 'katie-cassidy',
      recipient: KATIE_EMAIL,
      cc,
      subject,
      timestamp: new Date().toISOString(),
      message: 'MOCK: In production, email would be sent via SendGrid/Resend',
    });

  } catch (error: any) {
    console.error('Katie Cassidy export error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send report to Katie Cassidy',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve email history
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // In production, retrieve email history from database
    return NextResponse.json({
      emailHistory: [],
      message: 'Email history would be retrieved from database',
      recipient: KATIE_EMAIL,
    });

  } catch (error: any) {
    console.error('Get email history error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve email history' },
      { status: 500 }
    );
  }
}

