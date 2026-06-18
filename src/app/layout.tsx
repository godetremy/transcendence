import './globals.scss';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { ModalProvider } from '@/components/globals/ModalProvider/ModalProvider';

const montserrat = Montserrat({
	subsets: ['latin'],
	display: 'swap',
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
		<html lang="fr" className={`${montserrat.className}`}>
			<body>
				<ModalProvider>{children}</ModalProvider>
			</body>
		</html>
	);
}
