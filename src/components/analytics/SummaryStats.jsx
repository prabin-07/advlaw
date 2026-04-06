import Card from '../ui/Card'

const statCards = [
  {
    key: 'total',
    label: 'Total Cases',
    iconBg: 'bg-blue-900',
    iconColor: 'text-blue-400',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
  },
  {
    key: 'withAnalysis',
    label: 'AI Analyses',
    iconBg: 'bg-yellow-900',
    iconColor: 'text-yellow-400',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
  },
  {
    key: 'uniqueSections',
    label: 'Unique Sections',
    iconBg: 'bg-purple-900',
    iconColor: 'text-purple-400',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    ),
  },
  {
    key: 'uniqueIssues',
    label: 'Unique Issues',
    iconBg: 'bg-green-900',
    iconColor: 'text-green-400',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    ),
  },
  {
    key: 'totalLoopholes',
    label: 'Loopholes Identified',
    iconBg: 'bg-red-900',
    iconColor: 'text-red-400',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    ),
  },
]

/**
 * SummaryStats — renders five stat cards for the analytics dashboard.
 *
 * @param {{ stats: { total: number, withAnalysis: number, uniqueSections: number, uniqueIssues: number, totalLoopholes: number } }} props
 */
function SummaryStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statCards.map(({ key, label, iconBg, iconColor, icon }) => (
        <Card key={key}>
          <Card.Content className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1">{label}</p>
              <p className="text-3xl font-bold text-white">{stats[key] ?? 0}</p>
            </div>
            <div className={`${iconBg} rounded-full p-3`}>
              <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {icon}
              </svg>
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  )
}

export default SummaryStats
