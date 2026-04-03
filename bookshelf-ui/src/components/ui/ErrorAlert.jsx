export default function ErrorAlert({ error, onDismiss }) {
  if (!error) return null

  return (
    <div className="rounded-md bg-red-50 p-4 mb-4">
      <div className="flex">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">{error.message || 'An error occurred'}</h3>
          {error.details?.length > 0 && (
            <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
              {error.details.map((d, i) => (
                <li key={i}>{d.field}: {d.message}</li>
              ))}
            </ul>
          )}
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="text-red-500 hover:text-red-700 ml-2">
            &times;
          </button>
        )}
      </div>
    </div>
  )
}
