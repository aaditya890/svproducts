"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <h1 className="text-3xl font-bold text-navy">Something went wrong</h1>
      <p className="mt-2 max-w-md text-steel">Please try again. If the problem continues, call us and we will help you directly.</p>
      <button onClick={reset} className="mt-6 rounded-md bg-furnace px-6 py-3 font-semibold text-white hover:bg-navy">
        Try again
      </button>
    </main>
  );
}
