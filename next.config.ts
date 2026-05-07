import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [new URL('https://cdn.intra.42.fr/**')],
	},
};

export default nextConfig;
