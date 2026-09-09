/**
 * 静态导出目录的零依赖静态服务器（支持 /result?id=x → result.html 的 clean-URL 映射）
 * 用法：node scripts/serve-static.mjs [dir=out] [port=4174]
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.argv[2] ?? 'out')
const port = Number(process.argv[3] ?? 4174)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
    let file = path.join(root, urlPath)
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      // 目录：优先 index.html；否则回退 同名.html（如 /hexagrams → hexagrams.html）
      const indexFile = path.join(file, 'index.html')
      file = fs.existsSync(indexFile) ? indexFile : `${file}.html`
    } else if (!fs.existsSync(file)) {
      const candidate = file.endsWith('.html') ? file : `${file}.html`
      if (fs.existsSync(candidate)) file = candidate
    }
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain' })
      res.end('not found')
      return
    }
    res.writeHead(200, {
      'content-type': MIME[path.extname(file)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    })
    fs.createReadStream(file).pipe(res)
  } catch {
    res.writeHead(500, { 'content-type': 'text/plain' })
    res.end('server error')
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`[serve-static] ${root} → http://127.0.0.1:${port}`)
})
