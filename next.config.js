/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  exportPathMap: async function(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      '/': { page: '/' },
      '/measures-explorer': { page: '/measures-explorer' },
      '/mvp-factory': { page: '/mvp-factory' },
    }
  },
}

module.exports = nextConfig