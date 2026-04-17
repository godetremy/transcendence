import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'BDE 42',
	description: 'BDE website',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr" className={`${montserrat.className}`}>
			<body>{children}</body>
		</html>
	);
}
