import { STATUS_COLORS, GENRE_COLORS } from '../../constants'

export default function Badge({ text, variant, size = 'sm' }) {
  const color = STATUS_COLORS[variant] || GENRE_COLORS[text] || 'bg-gray-100 text-gray-600 border border-gray-200'
  const sizeClass = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'

  return (
    <span className={`inline-flex items-center rounded-full font-medium tracking-wide ${sizeClass} ${color}`}>
      {text}
    </span>
  )
}
