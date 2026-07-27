'use client';

import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import Image from 'next/image';
import { Fingerprint, KeyRound, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/globals/Loader/Loader';
import { TwoFactorAuth } from '@/types/TwoFactorAuth';
import { get } from '@/lib/fetcher';
import { Card } from '@/components/globals/Card/Card';
import { TotpConfiguration } from '@/components/2fa/TotpConfiguration/TotpConfiguration';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';
import { TotpDisable } from '@/components/2fa/TotpDisable/TotpDisable';
import { ResetPassword } from '@/components/globals/resetPassword/resetPassword';

export default function Page() {
	const { openModal, closeModal } = useModal();

	const [twoFactorAuthDetails, setTwoFactorAuthDetails] = useState<TwoFactorAuth | undefined>(undefined);
	const [showTotpConfiguration, setShowTotpConfiguration] = useState<boolean>(false);
	const [showTotpDisable, setShowTotpDisable] = useState<boolean>(false);
	const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
	const [resetPasswordLoading, setResetPasswordLoading] = useState<boolean>(false);

	const is2faEnabled = () => {
		return twoFactorAuthDetails?.mail || twoFactorAuthDetails?.totp || twoFactorAuthDetails?.passkey;
	};

	const cancelTotpConfiguration = () => {
		openModal({
			title: 'Voulez-vous vraiment annuler la configuration ?',
			message: 'Vous pourrez reprendre cette configuration à tout moment.',
			buttons: [
				{
					text: 'Revenir à la configuration',
					onClick: closeModal,
				},
				{
					text: 'Annuler la configuration',
					negative: true,
					onClick: () => {
						setShowTotpConfiguration(false);
						closeModal();
					},
				},
			],
		});
	};

	useEffect(() => {
		get<TwoFactorAuth>('/users/me/2fa').then(setTwoFactorAuthDetails);
	}, []);

	return (
		<NavigationBarHeader title={'Confidentialité & sécurité'}>
			<article className={styles.section}>
				<span className={styles.listSectionTitle}>Authentification à deux facteurs</span>
				<section className={styles.card_2fA}>
					{!twoFactorAuthDetails ? (
						<Loader />
					) : (
						<>
							<Image
								src={is2faEnabled() ? '/images/ok.svg' : '/images/failure.svg'}
								alt={is2faEnabled() ? 'checkmark' : 'cross'}
								width={80}
								height={80}
							/>

							<div>
								<h3>{is2faEnabled() ? 'Tu es protégé !' : "Ton compte n'est pas sécurisé..."}</h3>
								<p>
									{is2faEnabled()
										? 'Ton compte à au moins une méthode de double authentification.'
										: "Aucune méthode de double authentification n'est activé. Nous vous recommendons vivement d'en activer une dès maintenant."}
								</p>

								<span className={!twoFactorAuthDetails.passkey ? styles.disabled : undefined}>
									<Fingerprint /> Passkey
								</span>
								<span className={!twoFactorAuthDetails.totp ? styles.disabled : undefined}>
									<KeyRound /> Application TOTP
								</span>
								<span className={!twoFactorAuthDetails.mail ? styles.disabled : undefined}>
									<Mail /> Mail
								</span>
							</div>
						</>
					)}
				</section>
				{twoFactorAuthDetails && (
					<section className={styles.list}>
						{!twoFactorAuthDetails.totp && (
							<ListItem
								title={"Configurer l'application TOTP"}
								onPress={() => setShowTotpConfiguration(true)}
								last
							/>
						)}
						{twoFactorAuthDetails.totp && (
							<ListItem
								title={'Désactiver la double authentification par TOTP'}
								onPress={() => setShowTotpDisable(true)}
								last
							/>
						)}
					</section>
				)}
				<span className={styles.listSectionTitle}>Mot de passe</span>
				<section className={styles.list}>
					<ListItem title={'Changer le mot de passe'} onPress={() => setShowChangePassword(true)} last />
				</section>
			</article>
			<Card visible={showChangePassword} requestClose={() => setShowChangePassword(false)}>
				<ResetPassword
					onClose={() => setShowChangePassword(false)}
					onAccept={() => {
						setResetPasswordLoading(true);
						setTimeout(() => {
							setResetPasswordLoading(false);
							setShowChangePassword(false);
						}, 800);
					}}
					loading={resetPasswordLoading}
				/>
			</Card>
			<Card visible={showTotpConfiguration} requestClose={cancelTotpConfiguration}>
				<TotpConfiguration
					requestClose={cancelTotpConfiguration}
					forceClose={() => {
						setShowTotpConfiguration(false);
						setTwoFactorAuthDetails((prev) => ({ ...prev, totp: true }) as TwoFactorAuth);
					}}
				/>
			</Card>

			<Card visible={showTotpDisable} requestClose={() => setShowTotpDisable(false)}>
				<TotpDisable
					close={(disabled: boolean) => {
						setShowTotpDisable(false);
						setTwoFactorAuthDetails((prev) => ({ ...prev, totp: !disabled }) as TwoFactorAuth);
					}}
				/>
			</Card>
		</NavigationBarHeader>
	);
}
