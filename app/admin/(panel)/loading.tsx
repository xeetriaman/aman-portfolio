/** Shown instantly while an admin page loads its data, so every tap gets a response. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="motion-safe:animate-pulse">
      <div className="h-9 w-64 rounded-md bg-secondary" />
      <div className="mt-3 h-4 w-80 max-w-full rounded bg-secondary" />
      <div className="mt-12 divide-y border-y">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between gap-6 py-5">
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-secondary" />
              <div className="h-3 w-64 max-w-[60vw] rounded bg-secondary" />
            </div>
            <div className="hidden h-9 w-36 rounded-md bg-secondary sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
