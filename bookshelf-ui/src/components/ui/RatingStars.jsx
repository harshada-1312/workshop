export default function RatingStars({ value, onChange, readonly = false }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    const filled = value >= i
    const half = !filled && value >= i - 0.5
    stars.push(
      <button key={i} type="button" disabled={readonly}
        onClick={() => {
          if (!onChange) return
          onChange(value === i ? i - 0.5 : value === i - 0.5 ? 0 : i)
        }}
        className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-125'} transition-transform duration-150`}>
        {filled || half ? (
          <svg className="w-4 h-4 text-amber-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars}
      {value != null && <span className="ml-1.5 text-xs font-semibold text-gray-500">{value.toFixed(1)}</span>}
    </div>
  )
}
