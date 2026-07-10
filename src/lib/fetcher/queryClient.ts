import { QueryClient } from '@tanstack/react-query';

export const GlobalQueryClient = new QueryClient();

declare global {
	interface Window {
		__TANSTACK_QUERY_CLIENT__: QueryClient;
	}
}

if (typeof window !== 'undefined') {
	window.__TANSTACK_QUERY_CLIENT__ = GlobalQueryClient;
}
