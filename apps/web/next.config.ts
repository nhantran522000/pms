import type { NextConfig } from 'next';
import { withNx } from '@nx/next/plugins/with-nx';

const nextConfig: NextConfig = {
  nx: {},
  reactStrictMode: true,
  experimental: {
    // Ensure proper package resolution in monorepo
    optimizePackageImports: [],
  },
};

export default withNx(nextConfig);
