import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import { formatRelativeTime } from '../../utils/analyticsUtils'

/**
 * Truncates text to maxLen characters, appending "..." if truncated.
 * @param {string} text
 * @param {number} maxLen
 */
function truncate(text, maxLen = 120) {
  if (!text) return ''
  return text.length <= maxLen ? text : text.slice(0, maxLen) + '...'
}

function RecentCasesList({ cases = [] }) {
  const navigate = useNavigate()

  return (
    <Card>
      <Card.Header>
        <Card.Title>Recent Cases</Card.Title>
      </Card.Header>
      <Card.Content>
        {cases.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No recent cases</p>
        ) : (
          <ul className="space-y-2">
            {cases.map((c) => {
              const issueCount = c.analysis?.legal_issues?.length ?? 0
              return (
                <li
                  key={c._id}
                  onClick={() => navigate('/cases')}
                  className="flex items-start justify-between gap-3 p-3 rounded-md bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm leading-snug">
                      {truncate(c.case_text)}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formatRelativeTime(c.created_at)}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-300 bg-gray-600 rounded px-2 py-0.5 mt-0.5">
                    {issueCount} {issueCount === 1 ? 'issue' : 'issues'}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </Card.Content>
    </Card>
  )
}

export default RecentCasesList
