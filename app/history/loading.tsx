export default function Loading() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <div className="skeleton h-12 w-48" />
        <div className="skeleton mt-3 h-4 w-64" />
      </div>

      {/* 数据洞察骨架 */}
      <div className="mb-6 grid grid-cols-2 gap-px border-4 border-bagua-text bg-bagua-text md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-bagua-canvas p-4">
            <div className="skeleton mx-auto h-8 w-12" />
            <div className="skeleton mx-auto mt-2 h-3 w-16" />
          </div>
        ))}
      </div>

      {/* 筛选条 */}
      <div className="skeleton mb-6 h-12 w-full" />

      {/* 记录行骨架 */}
      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="paper-panel flex items-center gap-4 p-4">
            <div className="skeleton h-12 w-12 flex-shrink-0" />
            <div className="flex-1">
              <div className="skeleton h-5 w-32" />
              <div className="skeleton mt-2 h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
