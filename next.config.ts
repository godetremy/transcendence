import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({});

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [new URL('https://cdn.intra.42.fr/**')],
	},
  output: 'standalone',
};

export default withMDX(nextConfig);
