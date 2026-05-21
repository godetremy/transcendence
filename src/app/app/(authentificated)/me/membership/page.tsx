'use client';

import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';

export default function Page() {
	return (
		<>
			<NavigationBarHeader title={'Ton adhesion'}>
				<section className={styles.section}>
					<div className={styles.list}>
						<ListItem title={'Montant sur mon compte'} />
						<ListItem title={'Mes informations Bancaire'} />
						<ListItem title={'Mes abonnements'} />
					</div>
				</section>
			</NavigationBarHeader>
		</>
	);
}
