import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({});

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        unoptimized: true,
    },
    allowedDevOrigins: ['dev.bde.42angouleme.fr'],
    serverExternalPackages: ['@elastic/elasticsearch', '@sumup/sdk'],
};

export default withMDX(nextConfig);