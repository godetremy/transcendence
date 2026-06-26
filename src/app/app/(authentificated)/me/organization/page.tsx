'use client';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card } from '@/components/globals/Card/Card';
import OrganizationCreateDialog from '@/components/organization/OrganizationCreateDialog/OrganizationCreateDialog';
import { OrganizationsList } from '@/components/organization/OrganizationsList/OrganizationsList';
import { OrganizationInvitesList } from '@/components/organization/OrganizationInvitesList/OrganizationInvitesList';

export default function Page() {
	const user = useUser();

	const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);

	return (
		<NavigationBarHeader title={'Organisations'}>
			<article className={styles.section}>
				{user?.admin && (
					<>
						<span className={styles.listSectionTitle}>Administrateur</span>
						<section className={styles.list}>
							<ListItem
								title={'Créer une nouvelle organisation'}
								onPress={() => setShowCreateDialog(true)}
								last
							/>
						</section>
					</>
				)}

				<span className={styles.listSectionTitle}>Mes organisations</span>

				<section className={styles.list}>
					<OrganizationInvitesList></OrganizationInvitesList>
				</section>
				<section className={styles.list}>
					<OrganizationsList></OrganizationsList>
				</section>
			</article>
			<Card visible={showCreateDialog} requestClose={() => setShowCreateDialog(false)}>
				<OrganizationCreateDialog close={() => setShowCreateDialog(false)} />
			</Card>
		</NavigationBarHeader>
	);
}
