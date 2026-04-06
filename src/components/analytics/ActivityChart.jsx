import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Card from '../ui/Card'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm shadow-lg">
      <p className="text-gray-300 mb-1">{label}</p>
      <p className="text-white font-semibold">{payload[0].value} cases</p>
    </div>
  )
}

function ActivityChart({ data = [] }) {
  const isEmpty = !data.length || data.every((d) => d.count === 0)

  return (
    <Card>
      <Card.Header>
        <Card.Title>Case Activity</Card.Title>
      </Card.Header>
      <Card.Content>
        {isEmpty ? (
          <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
            No cases in this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#4b5563' }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card.Content>
    </Card>
  )
}

export default ActivityChart
