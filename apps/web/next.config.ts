import type { NextConfig } from 'next';
import { withNx } from '@nx/next/plugins/with-nx';

const nextConfig: NextConfig = {
  nx: {},
  // Disable build-time optimization to avoid prerendering issues with client components
  experimental: {
    optimizePackageImports: ['@tanstack/react-query', 'next-themes'],
  },
};

export default withNx(nextConfig);
