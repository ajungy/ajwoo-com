/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // dev and build get separate dist dirs (set in package.json scripts) so a
  // production build can never invalidate a running dev server's chunks.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
