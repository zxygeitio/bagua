export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12" aria-busy="true">
      <div className="skeleton mb-4 h-12 w-32" />
      <div className="skeleton mb-10 h-4 w-full max-w-2xl" />
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-8">
          <div className="paper-panel p-6 md:p-8">
            <div className="skeleton h-5 w-32" />
            <div className="skeleton mt-4 h-24 w-full" />
          </div>
          <div>
            <div className="skeleton mb-4 h-5 w-32" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="skeleton h-24" />
              <div className="skeleton h-24" />
            </div>
          </div>
          <div className="skeleton h-14 w-full" />
        </div>
        <aside className="skeleton hidden h-80 lg:block" />
      </div>
    </main>
  )
}
