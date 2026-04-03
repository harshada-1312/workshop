export default function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-14 w-14' }
  return (
    <div className="flex justify-center items-center py-16">
      <div className="relative">
        <div className={`${sizes[size]} rounded-full border-2 border-brand-100`} />
        <div className={`absolute inset-0 ${sizes[size]} rounded-full border-2 border-transparent border-t-brand-500 animate-spin`} />
      </div>
    </div>
  )
}
