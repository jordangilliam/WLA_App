import TeacherReviewPanel from '@/components/dashboard/TeacherReviewPanel'

export default function TeacherReviewPage() {
  return (
    <div className="space-y-8 px-4 py-6 md:px-8">
      <div>
        <p className="text-sm uppercase tracking-wide text-blue-600">Teacher Tools</p>
        <h1 className="text-3xl font-bold text-gray-900">Review Queue</h1>
        <p className="mt-2 text-sm text-gray-600">
          Approve student AI identifications and track soundscape submissions awaiting export.
        </p>
      </div>

      <TeacherReviewPanel />
    </div>
  )
}


