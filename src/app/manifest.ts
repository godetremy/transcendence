import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: '42BDE',
		short_name: '42BDE',
		description: '42 BDE',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#000000',
		icons: [
			{
				src: '/icons/42Icons-192-192px.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/icons/icon-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	};
}
