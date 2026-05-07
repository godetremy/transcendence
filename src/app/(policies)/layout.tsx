'use client';
import styles from './layout.module.scss';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import { usePathname } from 'next/navigation';

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();

	const pageTitles: Record<string, string> = {
		'/terms': "Conditions général d'utilisation",
		'/privacy': 'Politique de confidentialité',
	};
	return (
		<NavigationBarHeader title={pageTitles[pathname] ?? 'Aucun titre'}>
			<main className={styles.main}>{children}</main>
		</NavigationBarHeader>
	);
}
