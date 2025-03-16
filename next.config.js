/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    // Enable PPR since it's already enabled in your build
    ppr: true
  },
  // Ensure we don't try to use the dashboard route group in a way that causes issues
  transpilePackages: ['lucide-react'],
  // Add a custom webpack config to handle any issues
  webpack: (config, { isServer }) => {
    // Return the modified config
    return config;
  },
  // Skip API routes during static export
  skipTrailingSlashRedirect: true,
  skipApiRoutes: true,
};

module.exports = nextConfig; 