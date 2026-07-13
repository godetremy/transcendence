'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { GlobalQueryClient } from '@/lib/fetcher/queryClient';

export default function QueryProvider({ children }: { children: ReactNode }) {
	return <QueryClientProvider client={GlobalQueryClient}>{children}</QueryClientProvider>;
}
