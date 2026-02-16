export default function LoadingSpinner({ size = 'lg', className = '' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <div className={`${sizes[size]} border-2 border-hax-border border-t-hax-accent rounded-full animate-spin`} />
    </div>
  )
}
