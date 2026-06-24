import './globals.scss';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { ModalProvider } from '@/components/globals/ModalProvider/ModalProvider';
import QueryProvider from '@/components/globals/QueryProvider/QueryProvider';

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
			<body>
				<QueryProvider>
					<ModalProvider>{children}</ModalProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
