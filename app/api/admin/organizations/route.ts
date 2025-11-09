/**
 * Admin API for managing organizations
 * Only accessible to admins
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import { supabaseAdmin } from '@/lib/db/client'

// GET /api/admin/organizations - List all organizations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('email', session.user.email)
      .single()

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get all organizations with stats
    const { data: organizations, error } = await supabaseAdmin
      .from('organizations')
      .select(`
        *,
        organization_users (
          count
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Enhance with student counts
    const orgsWithCounts = await Promise.all(
      (organizations || []).map(async (org) => {
        // Count students in this organization
        const { count: studentCount } = await supabaseAdmin
          .from('organization_users')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', org.id)
          .eq('role', 'student')

        // Count teachers
        const { count: teacherCount } = await supabaseAdmin
          .from('organization_users')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', org.id)
          .eq('role', 'teacher')

        // Count active classes
        const { count: classCount } = await supabaseAdmin
          .from('classes')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', org.id)
          .eq('archived', false)

        return {
          ...org,
          studentCount: studentCount || 0,
          teacherCount: teacherCount || 0,
          classCount: classCount || 0,
        }
      })
    )

    return NextResponse.json({ organizations: orgsWithCounts })
  } catch (error) {
    console.error('Error fetching organizations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/organizations - Create new organization
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('email', session.user.email)
      .single()

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, type, contact_email, contact_name, max_students } = body

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type' },
        { status: 400 }
      )
    }

    // Create organization
    const { data: organization, error } = await supabaseAdmin
      .from('organizations')
      .insert({
        name,
        type,
        contact_email,
        contact_name,
        max_students,
        subscription_status: 'trialing', // Start with trial
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ organization }, { status: 201 })
  } catch (error) {
    console.error('Error creating organization:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

