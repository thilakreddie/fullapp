'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}
