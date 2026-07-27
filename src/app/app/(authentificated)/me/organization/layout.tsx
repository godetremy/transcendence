import { ReactNode } from 'react';
import { UploadProvider } from '@/contexts/UploadContext';

export default function Layout({ children }: { children: ReactNode }) {
	return <UploadProvider>{children}</UploadProvider>;
}
