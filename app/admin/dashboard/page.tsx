/**
 * Admin Dashboard for managing organizations, users, and licensing
 * Only accessible to admin users
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Organization {
  id: string
  name: string
  type: string
  subscription_status: string
  subscription_plan: string | null
  studentCount: number
  teacherCount: number
  classCount: number
  created_at: string
  subscription_current_period_end: string | null
}

export default function AdminDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrgs: 0,
    totalStudents: 0,
    totalTeachers: 0,
    activeSubscriptions: 0,
    revenue: 0,
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/api/auth/signin')
      return
    }

    loadData()
  }, [session, status, router])

  const loadData = async () => {
    try {
      const response = await fetch('/api/admin/organizations')
      
      if (response.status === 403) {
        alert('Access denied. You must be an admin to view this page.')
        router.push('/')
        return
      }

      const data = await response.json()
      setOrganizations(data.organizations || [])

      // Calculate stats
      const orgs = data.organizations || []
      setStats({
        totalOrgs: orgs.length,
        totalStudents: orgs.reduce((sum: number, org: Organization) => sum + org.studentCount, 0),
        totalTeachers: orgs.reduce((sum: number, org: Organization) => sum + org.teacherCount, 0),
        activeSubscriptions: orgs.filter((org: Organization) => 
          org.subscription_status === 'active' || org.subscription_status === 'trialing'
        ).length,
        revenue: 0, // Calculate from subscriptions
      })

      setLoading(false)
    } catch (error) {
      console.error('Error loading organizations:', error)
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      trialing: 'bg-blue-100 text-blue-800',
      past_due: 'bg-yellow-100 text-yellow-800',
      canceled: 'bg-red-100 text-red-800',
      incomplete: 'bg-gray-100 text-gray-800',
    }

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || colors.incomplete}`}>
        {status || 'none'}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage organizations, licensing, and system-wide settings
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Total Organizations</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalOrgs}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Total Students</div>
            <div className="mt-2 text-3xl font-bold text-green-600">{stats.totalStudents}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Total Teachers</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">{stats.totalTeachers}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Active Subscriptions</div>
            <div className="mt-2 text-3xl font-bold text-purple-600">{stats.activeSubscriptions}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Monthly Revenue</div>
            <div className="mt-2 text-3xl font-bold text-yellow-600">${stats.revenue}</div>
          </div>
        </div>

        {/* Organizations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Organizations</h2>
              <button
                onClick={() => router.push('/admin/organizations/new')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                + Add Organization
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teachers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{org.name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(org.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {org.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(org.subscription_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {org.subscription_plan || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {org.studentCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {org.teacherCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {org.classCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {org.subscription_current_period_end
                        ? new Date(org.subscription_current_period_end).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/admin/organizations/${org.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/admin/organizations/${org.id}/edit`)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

