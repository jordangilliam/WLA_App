/**
 * API Security Middleware
 * 
 * Provides comprehensive security for all API routes:
 * - Authentication checking
 * - Role-based access control (RBAC)
 * - Rate limiting
 * - Input validation
 * - CSRF protection
 * - Audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * User role hierarchy
 */
export const ROLE_HIERARCHY = {
  student: 0,
  parent: 1,
  educator: 2,
  admin: 3,
  partner: 3,
} as const;

export type UserRole = keyof typeof ROLE_HIERARCHY;

/**
 * Check if user is authenticated
 */
export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized - Please sign in' },
      { status: 401 }
    );
  }

  return session;
}

/**
 * Check if user has required role
 */
export async function requireRole(
  request: NextRequest,
  requiredRole: UserRole
): Promise<NextResponse | { user: any; session: any }> {
  const session = await requireAuth(request);
  
  if (session instanceof NextResponse) {
    return session; // Auth failed, return error response
  }

  const user = session.user as any;
  const userRole = user.role as UserRole;

  if (ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[requiredRole]) {
    return NextResponse.json(
      { 
        success: false, 
        error: `Forbidden - Requires ${requiredRole} role or higher` 
      },
      { status: 403 }
    );
  }

  return { user, session };
}

/**
 * Rate limiting using simple in-memory store
 * For production, use Redis (Upstash)
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(
  identifier: string, // User ID or IP address
  limit: number = 100, // requests per window
  windowMs: number = 60000 // 1 minute
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // Reset if window expired
  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    rateLimitStore.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  // Increment count
  record.count++;

  // Check if over limit
  if (record.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  return {
    allowed: true,
    remaining: limit - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Apply rate limiting middleware
 */
export async function withRateLimit(
  request: NextRequest,
  limit: number = 100
): Promise<NextResponse | null> {
  // Get identifier (user ID if authenticated, otherwise IP)
  const session = await getServerSession(authOptions);
  const identifier = session?.user?.email || 
                     request.headers.get('x-forwarded-for') || 
                     request.ip ||
                     'anonymous';

  const rateLimit = await checkRateLimit(identifier, limit);

  if (!rateLimit.allowed) {
    const resetIn = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      {
        success: false,
        error: `Rate limit exceeded. Try again in ${resetIn} seconds.`,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimit.resetAt.toString(),
          'Retry-After': resetIn.toString(),
        },
      }
    );
  }

  // Rate limit OK, continue
  return null;
}

/**
 * Validate request body with Zod schema
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ data: T } | NextResponse> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

/**
 * CSRF token validation
 * In production, use a proper CSRF library
 */
export async function validateCSRF(request: NextRequest): Promise<boolean> {
  // Skip CSRF check for GET requests
  if (request.method === 'GET') {
    return true;
  }

  // Check for CSRF token in header
  const csrfToken = request.headers.get('x-csrf-token');
  const session = await getServerSession(authOptions);

  // For now, just check that user is authenticated
  // TODO: Implement proper CSRF token generation and validation
  return !!session?.user;
}

/**
 * Log API access for audit trail
 */
export async function logAPIAccess(
  request: NextRequest,
  userId: string | null,
  action: string,
  resourceType: string,
  resourceId: string | null = null,
  success: boolean = true
) {
  if (!supabaseAdmin) {
    console.warn('Supabase admin client not available for audit logging');
    return;
  }

  try {
    // TODO: Create audit_logs table in database
    // For now, just console log
    console.log('[AUDIT]', {
      timestamp: new Date().toISOString(),
      userId,
      action,
      resourceType,
      resourceId,
      success,
      ip: request.headers.get('x-forwarded-for') || request.ip,
      userAgent: request.headers.get('user-agent'),
    });

    // In production, insert into database:
    // await supabaseAdmin.from('audit_logs').insert({
    //   user_id: userId,
    //   action,
    //   resource_type: resourceType,
    //   resource_id: resourceId,
    //   success,
    //   ip_address: request.headers.get('x-forwarded-for') || request.ip,
    //   user_agent: request.headers.get('user-agent'),
    // });
  } catch (error) {
    console.error('Failed to log API access:', error);
  }
}

/**
 * Complete API security wrapper
 * Combines all security checks
 */
export async function withSecurity(
  request: NextRequest,
  options: {
    requireRole?: UserRole;
    rateLimit?: number;
    validateCSRF?: boolean;
  } = {}
) {
  const {
    requireRole: role,
    rateLimit = 100,
    validateCSRF: checkCSRF = true,
  } = options;

  // 1. Rate limiting
  const rateLimitResponse = await withRateLimit(request, rateLimit);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // 2. CSRF validation
  if (checkCSRF) {
    const csrfValid = await validateCSRF(request);
    if (!csrfValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }
  }

  // 3. Authentication and authorization
  if (role) {
    const authResult = await requireRole(request, role);
    if (authResult instanceof NextResponse) {
      return authResult; // Auth/authz failed
    }
    return authResult; // Success, return user and session
  } else {
    const session = await requireAuth(request);
    if (session instanceof NextResponse) {
      return session; // Auth failed
    }
    return { user: session.user, session };
  }
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Check if user can access organization
 */
export async function checkOrganizationAccess(
  userId: string,
  orgId: string
): Promise<boolean> {
  if (!supabaseAdmin) {
    return false;
  }

  const { data, error } = await supabaseAdmin
    .from('organization_users')
    .select('org_id')
    .eq('user_id', userId)
    .eq('org_id', orgId)
    .single();

  return !error && !!data;
}

/**
 * Check if user is organization admin
 */
export async function isOrganizationAdmin(
  userId: string,
  orgId: string
): Promise<boolean> {
  if (!supabaseAdmin) {
    return false;
  }

  const { data, error } = await supabaseAdmin
    .from('organization_users')
    .select('role')
    .eq('user_id', userId)
    .eq('org_id', orgId)
    .single();

  return !error && data?.role === 'admin';
}

