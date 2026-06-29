'use client';
import styles from './page.module.scss';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import { OrganizationFollowersList } from '@/components/organization/OrganizationFollowersList/OrganizationFollowersList';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { ListSectionTitle } from '@/components/globals/ListSectionTitle/ListSectionTitle';

export default function Page() {
	const organizationCtx = useOrganizations();
	const organization = organizationCtx.getCurrentOrganization()!;
	return (
		<NavigationBarHeader title={'Followers'}>
			<div className={styles.page}>
				<ListSectionTitle>Followers</ListSectionTitle>
				<div className={styles.page_container}>
					<OrganizationFollowersList org_id={organization.id} />
				</div>
			</div>
		</NavigationBarHeader>
	);
}
