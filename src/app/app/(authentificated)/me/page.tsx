'use client';
import styles from './page.module.scss';
import { useUser } from '@/contexts/UserContext';
import { ProfileBanner } from '@/components/profile/ProfileBanner/ProfileBanner';
import { ListItem } from '@/components/globals/ListItem/ListItem';
import { BadgeDollarSign, BookOpenText, FileLock, GitCommitVerticalIcon, Lock, LogOut, User2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';

export default function Page() {
	const router = useRouter();
	const user = useUser();
	const { openModal, closeModal } = useModal();

	return (
		<>
			<ProfileBanner
				image={user?.profile_picture ?? ''}
				name={user?.full_name ?? 'Non connecté'}
				mail={user?.mail ?? 'Recharge la page pour te reconnecter'}
				subscribed={false}
			/>
			<section className={styles.section}>
				<div className={styles.list}>
					<ListItem icon={User2} title={'Mon compte'} description={'Mail, mot de passe'} />
					<ListItem
						icon={Lock}
						title={'Confidentialité & sécurité'}
						description={'Mot de passe et télémétrie'}
					/>
					<ListItem
						icon={BadgeDollarSign}
						title={'Ton adhesion'}
						description={'Gère ton adhesion au BDE'}
						last
					/>
				</div>

				<div className={styles.list}>
					<ListItem
						icon={GitCommitVerticalIcon}
						title={'Code source'}
						onPress={() => {
							window.open('https://github.com/godetremy/transcendence', '_blank', 'noopener,noreferrer');
						}}
					/>
					<ListItem
						icon={BookOpenText}
						title={'Condition d’utilisation'}
						onPress={() => router.push('/terms')}
					/>
					<ListItem
						icon={FileLock}
						title={'Politique de confidentialité'}
						last
						onPress={() => router.push('/privacy')}
					/>
				</div>

				<div className={styles.list}>
					<ListItem
						icon={LogOut}
						title={'Déconnexion'}
						last
						negative={true}
						showChevron={false}
						onPress={() => {
							openModal({
								title: 'Se déconnecter ?',
								message:
									'Vous allez être déconnecté de votre compte. Vous pourrez vous reconnecter à tout moment.',
								buttons: [
									{
										text: 'Annuler',
										onClick: closeModal,
									},
									{
										text: 'Se déconnecter',
										negative: true,
										onClick: () => {
											closeModal();
											router.push('/app/api/auth/logout');
										},
									},
								],
							});
						}}
					/>
				</div>
			</section>
		</>
	);
}
