import styles from './layout.module.scss';
import { ReactNode } from 'react';
import { OrganizationSidebar } from '@/components/organization/OrganizationSidebar/OrganizationSidebar';
import { OrganizationsProvider } from '@/contexts/OrganizationsContext';
import { getOrganizationWhereMemberBelongs } from '@/database/OrganizationMembers';
import { formatPrivateOrganization } from '@/database/format/Organization';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

export default async function Layout({ children }: { children: ReactNode }) {
	const Cookies = await cookies();
	const sessionCookie = Cookies.get('session');
	const session = await decrypt(sessionCookie?.value ?? '');

	const organizations = (await getOrganizationWhereMemberBelongs(session.user_id, { organization: true })).map(
		(member) => {
			return formatPrivateOrganization(member.organization);
		}
	);

	return (
		<OrganizationsProvider organizations={organizations}>
			<div className={styles.main_container}>
				<OrganizationSidebar>{children}</OrganizationSidebar>
			</div>
		</OrganizationsProvider>
	);
}
