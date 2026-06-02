import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({});

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [new URL('https://cdn.intra.42.fr/**')],
	},
	allowedDevOrigins: ['10.18.242.72', 'nanci-windswept-lingeringly.ngrok-free.dev'],
};

export default withMDX(nextConfig);
