import Card from '../ui/Card'

function TopItemsList({ items = [], title }) {
  const maxCount = items.length > 0 ? items[0].count : 0

  return (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Content>
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No data available</p>
        ) : (
          <ol className="space-y-3">
            {items.map((item, index) => {
              const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0
              return (
                <li key={index} className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm w-5 shrink-0">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white text-sm truncate pr-2">{item.name}</span>
                      <span className="text-gray-300 text-sm shrink-0">{item.count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </Card.Content>
    </Card>
  )
}

export default TopItemsList
