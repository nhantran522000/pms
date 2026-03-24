import type { NextConfig } from 'next';
import { withNx } from '@nx/next/plugins/with-nx';

const nextConfig: NextConfig = {
  nx: {},
};

export default withNx(nextConfig);
