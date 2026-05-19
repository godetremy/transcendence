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
						<span className={styles.listSectionTitle}>Mot de passe</span>
						<div className={styles.list}>
							<ListItem title={'Changer le mot de passe'} last />
						</div>
						<span className={styles.listSectionTitle}>Authentification à deux facteurs</span>
						<div className={styles.list}>
							<ListItem title={'Activer la 2FA'} />
							<ListItem title={"Gérer les clés d'accès"} />
							<ListItem title={'Gérer les applications de OTP'} />
							<ListItem title={'Rafraichir les codes de récupération'} last />
						</div>
					</section>
				</section>
			</NavigationBarHeader>
		</>
	);
}
