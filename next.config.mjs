/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Handle dynamic routes that shouldn't be statically generated
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

export default nextConfig
