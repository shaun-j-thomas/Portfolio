/** @type {import('next').NextConfig} */
// If deploying to a GitHub Pages repository subfolder (e.g. username.github.io/Portfolio or /portfolio),
// set NEXT_PUBLIC_BASE_PATH or update the fallback below.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  ...(basePath && {
    basePath,
    assetPrefix: basePath,
  }),
};

module.exports = nextConfig;
