/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  experimental: {
    // 静态导出不消费 build traces（无 server 部署），
    // 排除 node_modules 可显著缩短单核机器上「Collecting build traces」阶段耗时。
    outputFileTracingExcludes: {
      '*': ['./node_modules/**'],
    },
  },
};

module.exports = nextConfig;
