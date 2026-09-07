import { SiteShell } from '@/components/shared/SiteShell'

export default function Loading() {
  return (
    <SiteShell eyebrow="LEARN / 03">
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <div className="skeleton mb-3 h-3 w-24" />
        <div className="skeleton mb-4 h-12 w-48" />
        <div className="skeleton mb-12 h-4 w-96" />

        {/* Section 01 八卦总览骨架 */}
        <section className="mb-14">
          <div className="skeleton mb-3 h-6 w-40" />
          <div className="skeleton mb-6 h-3 w-72" />
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-20" />
            ))}
          </div>
        </section>

        {/* Section 02 起卦法骨架 */}
        <section className="mb-14">
          <div className="skeleton mb-3 h-6 w-40" />
          <div className="skeleton mb-6 h-3 w-72" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="paper-panel p-5">
                <div className="flex items-start gap-3">
                  <div className="skeleton h-12 w-12" />
                  <div className="flex-1">
                    <div className="skeleton h-4 w-20" />
                    <div className="skeleton mt-1 h-3 w-32" />
                  </div>
                </div>
                <div className="skeleton mt-3 h-3 w-full" />
                <div className="skeleton mt-1 h-3 w-3/4" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  )
}
