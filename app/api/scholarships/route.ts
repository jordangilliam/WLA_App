/**
 * Scholarship & Opportunity System API
 * Manages scholarships, internships, and other opportunities
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth.config';

// ============================================================================
// Scholarship Types
// ============================================================================

interface Scholarship {
  id: string;
  title: string;
  description: string;
  type: 'scholarship' | 'internship' | 'workshop' | 'mentorship' | 'grant';
  provider: string;
  providerId?: string; // Partner ID
  
  // Eligibility
  minAge?: number;
  maxAge?: number;
  minLevel?: number;
  minPoints?: number;
  requiredBadges?: string[];
  requiredAmbassadorLevel?: string;
  
  // Value
  amount?: number; // dollars
  benefits: string[];
  
  // Application
  applicationDeadline: Date;
  applicationUrl?: string;
  requiresEssay: boolean;
  requiresRecommendation: boolean;
  
  // Status
  isActive: boolean;
  spotsAvailable?: number;
  spotsFilled?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// GET /api/scholarships - List available opportunities
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type');
    const eligible = searchParams.get('eligible') === 'true';

    // Mock scholarships data
    const scholarships: Scholarship[] = [
      {
        id: '1',
        title: 'PA Wildlife Conservation Scholarship',
        description: 'Full scholarship for students pursuing conservation careers',
        type: 'scholarship',
        provider: 'PA Game Commission',
        providerId: 'pgc-001',
        minAge: 16,
        maxAge: 18,
        minLevel: 10,
        minPoints: 5000,
        requiredBadges: ['ambassador', 'conservationist'],
        amount: 5000,
        benefits: [
          '$5,000 for college tuition',
          'Summer internship with PGC',
          'Mentorship program',
        ],
        applicationDeadline: new Date('2025-12-31'),
        requiresEssay: true,
        requiresRecommendation: true,
        isActive: true,
        spotsAvailable: 10,
        spotsFilled: 3,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
      {
        id: '2',
        title: 'Summer Conservation Corps',
        description: 'Paid summer position working on conservation projects',
        type: 'internship',
        provider: 'PA DCNR',
        providerId: 'dcnr-001',
        minAge: 16,
        minLevel: 8,
        minPoints: 3000,
        amount: 4000,
        benefits: [
          '$4,000 stipend',
          'Hands-on conservation experience',
          'Housing provided',
          'Professional development',
        ],
        applicationDeadline: new Date('2025-11-30'),
        requiresEssay: true,
        requiresRecommendation: true,
        isActive: true,
        spotsAvailable: 50,
        spotsFilled: 12,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
      {
        id: '3',
        title: 'Young Naturalist Workshop Series',
        description: 'Free advanced training in field research methods',
        type: 'workshop',
        provider: 'Ned Smith Center',
        providerId: 'nedsmith-001',
        minAge: 14,
        minLevel: 5,
        minPoints: 1000,
        amount: 0,
        benefits: [
          '6-week workshop series',
          'Expert instruction',
          'Field equipment provided',
          'Certificate of completion',
        ],
        applicationDeadline: new Date('2025-10-15'),
        requiresEssay: false,
        requiresRecommendation: false,
        isActive: true,
        spotsAvailable: 20,
        spotsFilled: 8,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
      {
        id: '4',
        title: 'Environmental Leadership Mentorship',
        description: 'One-on-one mentorship with conservation professional',
        type: 'mentorship',
        provider: 'Western PA Conservancy',
        providerId: 'wpc-001',
        minAge: 15,
        minLevel: 12,
        minPoints: 8000,
        requiredAmbassadorLevel: 'ambassador',
        amount: 0,
        benefits: [
          '6-month mentorship program',
          'Monthly meetings',
          'Career guidance',
          'Networking opportunities',
        ],
        applicationDeadline: new Date('2025-09-30'),
        requiresEssay: true,
        requiresRecommendation: true,
        isActive: true,
        spotsAvailable: 15,
        spotsFilled: 7,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
      {
        id: '5',
        title: 'Youth Conservation Grant',
        description: 'Funding for student-led conservation projects',
        type: 'grant',
        provider: 'PA Environmental Council',
        minAge: 13,
        minLevel: 5,
        minPoints: 2000,
        amount: 1000,
        benefits: [
          'Up to $1,000 for project',
          'Project mentorship',
          'Recognition event',
        ],
        applicationDeadline: new Date('2025-08-31'),
        requiresEssay: true,
        requiresRecommendation: false,
        isActive: true,
        spotsAvailable: 30,
        spotsFilled: 5,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
    ];

    // Filter by type if specified
    let filtered = scholarships;
    if (type) {
      filtered = filtered.filter(s => s.type === type);
    }

    // Filter by eligibility if user is logged in and eligible filter is requested
    if (session?.user && eligible) {
      // TODO: Get user profile
      // const userProfile = await db.user.findUnique({
      //   where: { id: session.user.id },
      //   include: { badges: true },
      // });

      // Mock user profile
      const userProfile = {
        age: 16,
        level: 10,
        totalPoints: 6000,
        ambassadorLevel: 'ambassador',
        badges: ['ambassador', 'conservationist'],
      };

      filtered = filtered.filter(scholarship => {
        // Check age
        if (scholarship.minAge && userProfile.age < scholarship.minAge) return false;
        if (scholarship.maxAge && userProfile.age > scholarship.maxAge) return false;
        
        // Check level
        if (scholarship.minLevel && userProfile.level < scholarship.minLevel) return false;
        
        // Check points
        if (scholarship.minPoints && userProfile.totalPoints < scholarship.minPoints) return false;
        
        // Check badges
        if (scholarship.requiredBadges) {
          const hasAllBadges = scholarship.requiredBadges.every(badge =>
            userProfile.badges.includes(badge)
          );
          if (!hasAllBadges) return false;
        }
        
        // Check ambassador level
        if (scholarship.requiredAmbassadorLevel) {
          const levelOrder = ['novice', 'apprentice', 'ambassador', 'expert', 'master', 'legend'];
          const requiredIndex = levelOrder.indexOf(scholarship.requiredAmbassadorLevel);
          const userIndex = levelOrder.indexOf(userProfile.ambassadorLevel);
          if (userIndex < requiredIndex) return false;
        }

        return true;
      });
    }

    // Sort by deadline
    filtered.sort((a, b) => a.applicationDeadline.getTime() - b.applicationDeadline.getTime());

    return NextResponse.json({
      scholarships: filtered,
      total: filtered.length,
      eligibleCount: session?.user ? filtered.length : undefined,
    });
  } catch (error) {
    console.error('Scholarships fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/scholarships/apply - Submit application
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      scholarshipId,
      essay,
      recommendationName,
      recommendationEmail,
      additionalInfo,
    } = body;

    // Validate required fields
    if (!scholarshipId) {
      return NextResponse.json(
        { error: 'Missing scholarship ID' },
        { status: 400 }
      );
    }

    // TODO: Check if user is eligible
    // TODO: Check if user has already applied
    // TODO: Save application to database

    // const application = await db.scholarshipApplication.create({
    //   data: {
    //     userId: session.user.id,
    //     scholarshipId,
    //     essay,
    //     recommendationName,
    //     recommendationEmail,
    //     additionalInfo,
    //     status: 'submitted',
    //     submittedAt: new Date(),
    //   },
    // });

    // Send confirmation email
    // TODO: Implement email notification

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      // applicationId: application.id,
    });
  } catch (error) {
    console.error('Scholarship application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/scholarships/my-applications - Get user's applications
// ============================================================================

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Fetch user's applications
    // const applications = await db.scholarshipApplication.findMany({
    //   where: { userId: session.user.id },
    //   include: { scholarship: true },
    //   orderBy: { submittedAt: 'desc' },
    // });

    // Mock data
    const applications = [];

    return NextResponse.json({
      applications,
      total: applications.length,
    });
  } catch (error) {
    console.error('Applications fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

