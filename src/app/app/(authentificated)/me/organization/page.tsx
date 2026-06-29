'use client';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import { useState } from 'react';
import { Card } from '@/components/globals/Card/Card';
import OrganizationCreateDialog from '@/components/organization/OrganizationCreateDialog/OrganizationCreateDialog';
import { OrganizationsList } from '@/components/organization/OrganizationsList/OrganizationsList';
import { OrganizationInvitesList } from '@/components/organization/OrganizationInvitesList/OrganizationInvitesList';
import { ListSectionTitle } from '@/components/globals/ListSectionTitle/ListSectionTitle';
import { FAB } from '@/components/globals/FAB/FAB';
import { Plus } from 'lucide-react';

export default function Page() {
	const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);

	return (
		<NavigationBarHeader title={'Organisations'}>
			<article className={styles.section}>
				<OrganizationInvitesList />

				<ListSectionTitle>Mes organisations</ListSectionTitle>
				<OrganizationsList />
			</article>

			<FAB onClick={() => setShowCreateDialog(true)}>
				<Plus />
			</FAB>
			<Card visible={showCreateDialog} requestClose={() => setShowCreateDialog(false)}>
				<OrganizationCreateDialog close={() => setShowCreateDialog(false)} />
			</Card>
		</NavigationBarHeader>
	);
}
