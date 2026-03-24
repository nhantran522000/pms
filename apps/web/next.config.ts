import type { NextConfig } from 'next';
import { composePlugins, withNx } from '@nx/next/plugins/with-nx';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig: NextConfig = {
  // Static export configuration for hosting on Caddy alongside API
  output: 'export',

  // Images must be unoptimized for static export
  images: {
    unoptimized: true,
  },

  // Trailing slash for consistent URLs
  trailingSlash: true,

  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

export default composePlugins(...plugins)(nextConfig);
