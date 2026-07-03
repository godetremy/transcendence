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
import { useQuery } from '@tanstack/react-query';
import { getOrganizationFollowerNumber } from '@/lib/fetcher/organization';

export default function Page() {
	const organizationCtx = useOrganizations();
	const organization = organizationCtx.getCurrentOrganization()!;
	const user = useUser();
	const { openModal } = useModal();
	const router = useRouter();

	const { data, isLoading } = useQuery(getOrganizationFollowerNumber(organization.id));

	const transferOwnership = () => {
		openModal({
			title: 'Transférer la propriété',
			message:
				"Choisis un membre de ton organisation à qui transmettre la propriété de l'organisation. Tu perdras tes droits d'administrateur et seules ses permissions compteront désormais.",
			textInput: {
				label: 'Membre',
				placeholder: 'Rechercher un membre',
				onRequestCompletion: async (value) => {
					console.log('searching for ', value);
					return [];
				},
			},
			buttons: [
				{ text: 'Je conserve mes droits' },
				{
					text: 'Transférer la propriété',
					negative: true,
					onClick: (event) => {
						event.preventClosing();
					},
				},
			],
		});
	};

	const leaveOrganisation = () => {
		openModal({
			title: 'Veux-tu vraiment quitter cette organisation ?',
			message:
				"Tu ne pourras pas la rejoindre à nouveau tant que tu n'as pas reçu une nouvelle invitation. Un fois quitter, tu serras redirigé vers ton profil.",
			canClose: true,
			buttons: [
				{
					text: 'Finalement je reste',
				},
				{
					text: "Quitter l'organisation",
					negative: true,
					onClick: () => {
						deletef(`/organization/${organization.id}/members/me`, {}).then(() => {
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
						description={
							isLoading || data === undefined
								? 'Étudiants qui suivent ton organization'
								: `${data.number} personnes suivent ton organisation`
						}
						onPress={() => router.push('settings/followers')}
						last
					/>
				</ListContainer>
				<ListContainer>
					{organization.owner_id === (user?.id ?? '') && (
						<ListItem
							icon={Handshake}
							title={'Transférer la propriété'}
							negative={true}
							showChevron={false}
							onPress={transferOwnership}
						/>
					)}
					<ListItem
						icon={LogOut}
						title={"Quitter l'organisation"}
						last
						negative={true}
						showChevron={false}
						onPress={leaveOrganisation}
						disabled={organization.owner_id === (user?.id ?? '')}
					/>
				</ListContainer>
				{organization.owner_id === (user?.id ?? '') && (
					<span className={styles.listSectionDetails}>
						Tu ne peux pas quitter cette organisation car tu en es le propriétaire. Avant de quitter,
						transfère ton rôle à un autre membre.
					</span>
				)}
			</section>
		</>
	);
}
