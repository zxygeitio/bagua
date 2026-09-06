import ResultClient from './ResultClient'

// 历史记录 ID 在客户端运行时生成（localStorage），静态导出时无法预知。
// 返回占位参数让 Next.js 至少生成一个静态页面壳，由客户端组件在 hydration 时读取实际记录。
export function generateStaticParams(): Array<{ id: string }> {
  return [{ id: 'placeholder' }]
}

export default function ResultPage() {
  return <ResultClient />
}
