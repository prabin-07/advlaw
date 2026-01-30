/**
 * Card Component - Reusable card container with consistent styling
 * Maintains the existing dark theme design patterns
 */
function Card({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = false 
}) {
  const baseClasses = 'bg-gray-800 rounded-lg shadow border border-gray-700'
  const hoverClasses = hover ? 'hover:border-gray-600 transition-colors' : ''
  
  const classes = `${baseClasses} ${hoverClasses} ${padding} ${className}`

  return (
    <div className={classes}>
      {children}
    </div>
  )
}

/**
 * CardHeader Component - Header section for cards
 */
function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

/**
 * CardTitle Component - Title for card headers
 */
function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-white ${className}`}>
      {children}
    </h3>
  )
}

/**
 * CardContent Component - Main content area for cards
 */
function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

// Export all components
Card.Header = CardHeader
Card.Title = CardTitle
Card.Content = CardContent

export default Card