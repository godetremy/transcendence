'use client';
import styles from './page.module.scss';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import { OrganizationFollowersList } from '@/components/organization/OrganizationFollowersList/OrganizationFollowersList';
import { useOrganizations } from '@/contexts/OrganizationsContext';

export default function Page() {
	const organizationCtx = useOrganizations();
	const organization = organizationCtx.getCurrentOrganization()!;
	return (
		<NavigationBarHeader title={'Followers'}>
			<p>Followers</p>
			<div className={styles.page_container}>
				<OrganizationFollowersList org_id={organization.id} />
			</div>
		</NavigationBarHeader>
	);
}
