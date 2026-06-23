'use client';
import { OrganizationBanner } from '@/components/organization/OrganizationBanner/OrganizationBanner';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import { Handshake, KeyRound, LogOut, Paintbrush, UsersRound } from 'lucide-react';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';
import { deletef } from '@/lib/fetcher';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import ListContainer from '@/components/globals/ListContainer/ListContainer';

export default function Page() {
	const organizationCtx = useOrganizations();
	const organization = organizationCtx.getCurrentOrganization()!;
	const user = useUser();
	const { openModal, closeModal } = useModal();
	const router = useRouter();

	const leaveOrganisation = () => {
		openModal({
			title: 'Veux-tu vraiment quitter cette organisation ?',
			message:
				"Tu ne pourras pas la rejoindre à nouveau tant que tu n'as pas reçu une nouvelle invitation. Un fois quitter, tu serras redirigé vers ton profil.",
			canClose: true,
			buttons: [
				{
					text: 'Finalement je reste',
					onClick: closeModal,
				},
				{
					text: "Quitter l'organisation",
					negative: true,
					onClick: () => {
						deletef(`/organization/${organization.id}/members/me`, {}).then(() => {
							closeModal();
							router.replace('/app/me');
						});
					},
				},
			],
		});
	};

	return (
		<>
			<OrganizationBanner
				logo={
					organization.logo ??
					`https://api.dicebear.com/10.x/initials/png?size=256&seed=${encodeURI(organization.name)}`
				}
				name={organization.name}
				description={organization.description ?? 'Aucune description'}
			/>
			<section className={styles.section}>
				<ListContainer>
					<ListItem
						icon={Paintbrush}
						title={"A propos de l'organisation"}
						description={"Modifie les informations de l'organisation"}
						onPress={() => router.push('settings/edit')}
					/>
					<ListItem
						icon={KeyRound}
						title={'Membres et permission'}
						description={'Invite des membres et modifie leurs permissions'}
						onPress={() => router.push('settings/members')}
					/>
					<ListItem
						icon={UsersRound}
						title={'Followers'}
						description={'350 personnes suivent ton organisation'}
						onPress={() => router.push('settings/followers')}
						last
					/>
				</ListContainer>
				<ListContainer>
					{organization.owner === (user?.id ?? '') && (
						<ListItem
							icon={Handshake}
							title={'Transférer la propriété'}
							negative={true}
							showChevron={false}
							onPress={() => {}}
						/>
					)}
					<ListItem
						icon={LogOut}
						title={"Quitter l'organisation"}
						last
						negative={true}
						showChevron={false}
						onPress={leaveOrganisation}
						disabled={organization.owner === (user?.id ?? '')}
					/>
				</ListContainer>
				{organization.owner === (user?.id ?? '') && (
					<span className={styles.listSectionDetails}>
						Tu ne peux pas quitter cette organisation car tu en es le propriétaire. Avant de quitter,
						transfère ton rôle à un autre membre.
					</span>
				)}
			</section>
		</>
	);
}
