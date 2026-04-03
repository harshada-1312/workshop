import { STATUS_COLORS } from '../../constants'

export default function Badge({ text, variant }) {
  const color = STATUS_COLORS[variant] || 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {text}
    </span>
  )
}
