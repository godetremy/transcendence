'use client';

import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';

export default function Page() {
	return (
		<>
			<NavigationBarHeader title={'Confidentialité & sécurité'}>
				<article className={styles.section}>
					<span className={styles.listSectionTitle}>Mot de passe</span>
					<section className={styles.list}>
						<ListItem title={'Changer le mot de passe'} last />
					</section>
					<span className={styles.listSectionTitle}>Authentification à deux facteurs</span>
					<section className={styles.list}>
						<ListItem title={'Activer la 2FA'} />
						<ListItem title={"Gérer les clés d'accès"} />
						<ListItem title={'Gérer les applications de OTP'} />
						<ListItem title={'Rafraichir les codes de récupération'} last />
					</section>
				</article>
			</NavigationBarHeader>
		</>
	);
}
