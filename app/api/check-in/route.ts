/**
 * Check-In API Route
 * Handles location check-ins with verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth.config';
import { 
  calculateDistance, 
  calculateLocationConfidence, 
  isWithinCheckInRadius 
} from '@/lib/utils/geolocation';
import type { Coordinates } from '@/lib/types/location.types';

// ============================================================================
// POST /api/check-in - Create a new check-in
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      locationId,
      coordinates,
      verificationMethod = 'gps',
      qrCode,
      photoUrl,
      photoExif,
    } = body;

    // Validate required fields
    if (!locationId || !coordinates) {
      return NextResponse.json(
        { error: 'Missing required fields: locationId, coordinates' },
        { status: 400 }
      );
    }

    // TODO: Fetch location from database
    // const location = await db.location.findUnique({ where: { id: locationId } });
    // For now, mock location data
    const location = {
      id: locationId,
      name: 'Sample Location',
      coordinates: { latitude: 40.2732, longitude: -76.8867 },
      checkInRadius: 100,
      basePoints: 10,
      firstVisitBonus: 50,
    };

    const userCoords: Coordinates = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      accuracy: coordinates.accuracy,
    };

    // Calculate distance and verify location
    const distance = calculateDistance(userCoords, location.coordinates);
    const isWithinRadius = isWithinCheckInRadius(userCoords, location as any);
    const confidence = calculateLocationConfidence(userCoords, location as any);

    // Check if verification is sufficient
    if (!isWithinRadius) {
      return NextResponse.json(
        {
          error: 'Location verification failed',
          message: `You are ${Math.round(distance)}m away from this location. Please move closer to check in.`,
          distance,
          requiredRadius: location.checkInRadius,
        },
        { status: 400 }
      );
    }

    // Calculate points earned
    let pointsEarned = location.basePoints;
    
    // TODO: Check if first visit
    const isFirstVisit = true; // await checkFirstVisit(session.user.id, locationId);
    if (isFirstVisit) {
      pointsEarned += location.firstVisitBonus;
    }

    // TODO: Apply distance multiplier for remote locations
    // if (location.distanceMultiplier) {
    //   pointsEarned = Math.round(pointsEarned * location.distanceMultiplier);
    // }

    // Create check-in record
    const checkIn = {
      id: crypto.randomUUID(),
      userId: session.user.id,
      locationId,
      checkInTime: new Date(),
      coordinates: userCoords,
      verification: {
        method: verificationMethod,
        confidence,
        metadata: {
          distance,
          gpsAccuracy: userCoords.accuracy,
          qrCode,
          photoUrl,
          photoExif,
        },
      },
      isVerified: confidence >= 70,
      pointsEarned,
      badgesEarned: [], // TODO: Check for badge unlocks
      achievementsUnlocked: [],
    };

    // TODO: Save to database
    // await db.userVisit.create({ data: checkIn });

    // TODO: Update user points
    // await db.user.update({
    //   where: { id: session.user.id },
    //   data: {
    //     totalPoints: { increment: pointsEarned },
    //     availablePoints: { increment: pointsEarned },
    //   },
    // });

    // TODO: Update location visit counts
    // await db.location.update({
    //   where: { id: locationId },
    //   data: {
    //     totalVisits: { increment: 1 },
    //   },
    // });

    // TODO: Check for unlocked achievements and badges
    // const newAchievements = await checkAchievements(session.user.id, checkIn);
    // const newBadges = await checkBadges(session.user.id, checkIn);

    // TODO: Create notification
    // await createNotification({
    //   userId: session.user.id,
    //   type: 'check_in_success',
    //   title: `Checked in at ${location.name}!`,
    //   message: `You earned ${pointsEarned} points${isFirstVisit ? ' (First visit bonus!)' : ''}`,
    // });

    return NextResponse.json({
      success: true,
      checkIn: {
        id: checkIn.id,
        location: {
          id: location.id,
          name: location.name,
        },
        pointsEarned,
        isFirstVisit,
        confidence,
        distance: Math.round(distance),
        newAchievements: [], // TODO: Include actual achievements
        newBadges: [], // TODO: Include actual badges
        message: isFirstVisit 
          ? `🎉 First visit to ${location.name}! +${pointsEarned} points!` 
          : `✅ Checked in at ${location.name}. +${pointsEarned} points!`,
      },
    });

  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/check-in - Get user's check-in history
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const locationId = searchParams.get('locationId');

    // TODO: Fetch check-ins from database
    // const checkIns = await db.userVisit.findMany({
    //   where: {
    //     userId: session.user.id,
    //     ...(locationId && { locationId }),
    //   },
    //   orderBy: { checkInTime: 'desc' },
    //   take: limit,
    //   skip: offset,
    //   include: {
    //     location: true,
    //   },
    // });

    // Mock data
    const checkIns = [];
    const total = 0;

    return NextResponse.json({
      checkIns,
      pagination: {
        total,
        limit,
        offset,
        hasMore: total > offset + limit,
      },
    });

  } catch (error) {
    console.error('Check-in fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH /api/check-in/[id] - Update check-in (e.g., check-out)
// ============================================================================

export async function PATCH(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { checkInId, checkOutTime, notes, rating, review, photos } = body;

    if (!checkInId) {
      return NextResponse.json(
        { error: 'Missing required field: checkInId' },
        { status: 400 }
      );
    }

    // TODO: Fetch and verify check-in belongs to user
    // const checkIn = await db.userVisit.findUnique({
    //   where: { id: checkInId },
    // });

    // if (!checkIn || checkIn.userId !== session.user.id) {
    //   return NextResponse.json(
    //     { error: 'Check-in not found' },
    //     { status: 404 }
    //   );
    // }

    // Calculate duration if checking out
    let durationMinutes;
    if (checkOutTime) {
      // const duration = new Date(checkOutTime).getTime() - checkIn.checkInTime.getTime();
      // durationMinutes = Math.round(duration / 1000 / 60);
    }

    // TODO: Update check-in
    // const updated = await db.userVisit.update({
    //   where: { id: checkInId },
    //   data: {
    //     checkOutTime,
    //     durationMinutes,
    //     notes,
    //     rating,
    //     review,
    //     photosSubmitted: photos,
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: 'Check-in updated successfully',
      // checkIn: updated,
    });

  } catch (error) {
    console.error('Check-in update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if this is the user's first visit to a location
 */
async function checkFirstVisit(userId: string, locationId: string): Promise<boolean> {
  // TODO: Implement database query
  // const existingVisit = await db.userVisit.findFirst({
  //   where: { userId, locationId },
  // });
  // return !existingVisit;
  return true;
}

/**
 * Check and award any newly unlocked achievements
 */
async function checkAchievements(userId: string, checkIn: any) {
  // TODO: Implement achievement checking logic
  // - Total locations visited
  // - Specific location types
  // - Regional coverage
  // - Visit streaks
  // etc.
  return [];
}

/**
 * Check and award any newly unlocked badges
 */
async function checkBadges(userId: string, checkIn: any) {
  // TODO: Implement badge checking logic
  // - Explorer badges (visit counts)
  // - Regional badges
  // - Special location badges
  // etc.
  return [];
}

