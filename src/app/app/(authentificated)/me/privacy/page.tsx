'use client';

import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import Image from 'next/image';
import { Fingerprint, KeyRound, Mail } from 'lucide-react';

export default function Page() {
	return (
		<>
			<NavigationBarHeader title={'Confidentialité & sécurité'}>
				<article className={styles.section}>
					<span className={styles.listSectionTitle}>Authentification à deux facteurs</span>
					<section className={styles.card_2fA}>
						<Image src={'/images/ok.svg'} alt={'checkmark'} width={80} height={80} />

						<div>
							<h3>Tu es protégé !</h3>
							<p>Ton compte à au moins deux méthode de double authentification.</p>

							<span>
								<Fingerprint /> Passkey
							</span>
							<span>
								<KeyRound /> Application d&#39;authentification
							</span>
							<span className={styles.disabled}>
								<Mail /> Mail
							</span>
						</div>
					</section>
					<section className={styles.list}>
						<ListItem title={'Activer la 2FA'} />
						<ListItem title={"Gérer les clés d'accès"} />
						<ListItem title={'Gérer les applications de OTP'} />
						<ListItem title={'Rafraichir les codes de récupération'} last />
					</section>
					<span className={styles.listSectionTitle}>Mot de passe</span>
					<section className={styles.list}>
						<ListItem title={'Changer le mot de passe'} last />
					</section>
				</article>
			</NavigationBarHeader>
		</>
	);
}
