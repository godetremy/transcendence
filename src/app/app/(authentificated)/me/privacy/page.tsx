'use client';

import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';

export default function Page() {
	return (
		<>
			<NavigationBarHeader title={'Confidentialité & sécurité'}>
				<section className={'content'}>
					<section className={styles.section}>
						<div className={styles.list}>
							<ListItem title={'Changer le mot de passe'} />
							<ListItem title={'Two-factor-authentification'} />
						</div>
					</section>
				</section>
			</NavigationBarHeader>
		</>
	);
}
