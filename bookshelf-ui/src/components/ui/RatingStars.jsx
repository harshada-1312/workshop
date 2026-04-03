export default function RatingStars({ value, onChange, readonly = false }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    const filled = value >= i
    const half = !filled && value >= i - 0.5
    stars.push(
      <button key={i} type="button" disabled={readonly}
        onClick={() => {
          if (!onChange) return
          // Click toggles between i-0.5 and i
          onChange(value === i ? i - 0.5 : value === i - 0.5 ? 0 : i)
        }}
        className={`text-lg ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}>
        {filled ? (
          <span className="text-yellow-400">&#9733;</span>
        ) : half ? (
          <span className="text-yellow-400">&#9733;</span>
        ) : (
          <span className="text-gray-300">&#9733;</span>
        )}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars}
      {value != null && <span className="ml-1 text-sm text-gray-600">{value.toFixed(1)}</span>}
    </div>
  )
}
