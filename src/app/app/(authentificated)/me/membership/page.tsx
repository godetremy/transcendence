'use client';

import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';

export default function Page() {
	return (
		<>
			<NavigationBarHeader title={'Ton adhesion'}>
				<section className={styles.section}>
					<div className={styles.list}>
						<h1>Hello, world !</h1>
					</div>
				</section>
			</NavigationBarHeader>
		</>
	);
}
