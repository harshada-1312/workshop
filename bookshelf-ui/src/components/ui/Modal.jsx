export default function Modal({ open, onClose, onConfirm, title, children, confirmText = 'Confirm', confirmVariant = 'danger' }) {
  if (!open) return null

  const btnClass = confirmVariant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-indigo-600 hover:bg-indigo-700 text-white'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500/75 transition-opacity" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <div className="text-sm text-gray-500 mb-6">{children}</div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={onConfirm}
              className={`rounded-md px-4 py-2 text-sm font-medium ${btnClass}`}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
