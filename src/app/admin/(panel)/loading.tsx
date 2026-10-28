export default function Loading() {
  return (
    <div className="max-w-5xl animate-pulse">
      <div className="h-8 w-56 rounded-md bg-navy/10" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-white shadow-sm" />
        ))}
      </div>
      <div className="mt-6 h-72 rounded-xl bg-white shadow-sm" />
    </div>
  );
}
