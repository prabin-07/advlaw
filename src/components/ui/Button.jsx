function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center justify-center'
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white focus:ring-green-500',
    outline: 'border border-gray-600 hover:bg-gray-800 disabled:bg-gray-800 text-gray-300 hover:text-white focus:ring-gray-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button