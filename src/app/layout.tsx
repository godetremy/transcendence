import './globals.scss';
import type { Metadata } from 'next';
import { Flow_Circular, Montserrat } from 'next/font/google';
import { ModalProvider } from '@/components/globals/ModalProvider/ModalProvider';
import QueryProvider from '@/components/globals/QueryProvider/QueryProvider';
import { ToastProvider } from '@/components/globals/ToastProvider/ToastProvider';

const montserrat = Montserrat({
	subsets: ['latin'],
	display: 'swap',
});

const flowCircular = Flow_Circular({
	weight: ['400'],
});

export const metadata: Metadata = {
	title: '42BDE',
	description: 'BDE website',
};

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: 'cover',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr" className={`${montserrat.className} ${flowCircular.className}`}>
			<body>
				<QueryProvider>
					<ModalProvider>
						<ToastProvider>{children}</ToastProvider>
					</ModalProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
