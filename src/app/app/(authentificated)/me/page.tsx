'use client';
import styles from './page.module.scss';
import { useUser } from '@/contexts/UserContext';
import { ProfileBanner } from '@/components/profile/ProfileBanner/ProfileBanner';
import ListItem from '@/components/globals/ListItem/ListItem';
import {
	BadgeDollarSign,
	BookOpenText,
	Building2,
	Code,
	FileLock,
	GitCommitVerticalIcon,
	KeyRound,
	Lock,
	LogOut,
	User2,
	Vote,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';
import { MembershipButton } from '@/components/membership/MembershipButton/MembershipButton';
import { useMutation } from '@tanstack/react-query';
import { logoutUser } from '@/lib/fetcher/user';
import { getCsrfTokenFromCookie } from '@/utils/csrf';

export default function Page() {
	const router = useRouter();
	const user = useUser();
	const { openModal, closeModal } = useModal();

	const { mutateAsync } = useMutation(logoutUser({ 'x-csrf-token': getCsrfTokenFromCookie() ?? '' }));

	return (
		<>
			<ProfileBanner
				image={user?.profile_picture ?? ''}
				name={user?.full_name ?? 'Non connecté'}
				mail={user?.mail ?? 'Recharge la page pour te reconnecter'}
				subscribed={false}
			/>
			<section className={styles.section}>
				<MembershipButton className={styles.card_button} />

				<div className={styles.list}>
					<ListItem
						icon={User2}
						title={'Mon compte'}
						description={'Mail, mot de passe'}
						onPress={() => router.push('/app/me/account')}
					/>
					<ListItem
						icon={Lock}
						title={'Confidentialité & sécurité'}
						description={'Mot de passe et télémétrie'}
						onPress={() => router.push('/app/me/privacy')}
					/>
					<ListItem
						icon={BadgeDollarSign}
						title={'Ton adhesion'}
						description={'Gère ton adhesion au BDE'}
						onPress={() => router.push('/app/me/membership')}
					/>
					<ListItem
						icon={Building2}
						title={'Organisation'}
						description={'Gère tes organisations'}
						onPress={() => router.push('/app/me/organization')}
					/>
					<ListItem
						icon={Code}
						title={'Développeurs'}
						description={'Gère tes applications et clés API'}
						onPress={() => router.push('/app/me/api')}
						last={!user?.admin}
					/>
					{user?.admin && (
						<>
							<ListItem
								icon={Vote}
								title={'Demandes d’accès agents'}
								description={'Gère les demandes de création des comptes agents'}
								onPress={() => router.push('/app/me/agents')}
							/>
							<ListItem
								icon={KeyRound}
								title={'Administrateurs'}
								description={'Gère les membres administrateurs'}
								onPress={() => router.push('/app/me/administration')}
								last
							/>
						</>
					)}
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
										onClick: async () => {
											closeModal();
											const check = await mutateAsync();
											if (check.success) router.push('/app/login');
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
