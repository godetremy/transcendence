'use client';
import { OrganizationBanner } from '@/components/organization/OrganizationBanner/OrganizationBanner';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import { KeyRound, LogOut, Paintbrush, UsersRound } from 'lucide-react';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';

export default function Page() {
	const organizationCtx = useOrganizations();
	const organization = organizationCtx.getCurrentOrganization()!;
	const { openModal, closeModal } = useModal();

	const leaveOrganisation = () => {
		openModal({
			title: 'Veux-tu vraiment quitter cette organisation ?',
			message:
				"Tu ne pourras pas la rejoindre à nouveau tant que tu n'as pas reçu une nouvelle invitation. Un fois quitter, tu serras redirigé vers ton profil.",
			canClose: true,
			buttons: [
				{ text: 'Finalement je reste', onClick: closeModal },
				{ text: "Quitter l'organisation", negative: true, onClick: closeModal },
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
				<div className={styles.list}>
					<ListItem
						icon={Paintbrush}
						title={"A propos de l'organisation"}
						description={"Modifie les informations de l'organisation"}
						onPress={() => {}}
					/>
					<ListItem
						icon={KeyRound}
						title={'Membres et permission'}
						description={'Invite des membres et modifie leurs permissions'}
						onPress={() => {}}
					/>
					<ListItem
						icon={UsersRound}
						title={'Followers'}
						description={'350 personnes suivent ton organisation'}
						onPress={() => {}}
						last
					/>
				</div>
				<div className={styles.list}>
					<ListItem
						icon={LogOut}
						title={"Quitter l'organisation"}
						last
						negative={true}
						showChevron={false}
						onPress={leaveOrganisation}
					/>
				</div>
			</section>
		</>
	);
}
