// Force dynamic rendering - requires authentication
export const dynamic = 'force-dynamic';

import TeacherDashboardClient from './TeacherDashboardClient';

export default function TeacherDashboardPage() {
  return <TeacherDashboardClient />;
}
