/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for GitHub Pages deployment
  output: 'export',
  // GitHub Pages requires trailing slash for proper routing
  trailingSlash: true,
  // Required for static export
  images: {
    unoptimized: true
  },
  // Base path will be automatically injected by GitHub Actions
  // Uncomment if you want to set it manually for local development
  // basePath: process.env.NODE_ENV === 'production' ? '/chaos-atlas' : '',
}

module.exports = nextConfig