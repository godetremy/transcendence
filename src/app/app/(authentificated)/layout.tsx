import styles from './layout.module.scss';
import { UserProvider } from '@/contexts/UserContext';
import { getUserFromSession } from '@/database/User';
import Sidebar from '@/components/globals/Sidebar/Sidebar';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { formatPrivateUser } from '@/database/format/User';
import { MembershipProvider } from '@/components/membership/MembershipProvider/MembershipProvider';
import { OrganizationsProvider } from '@/contexts/OrganizationsContext';
import { getOrganizationWhereMemberBelongs } from '@/database/OrganizationMembers';
import { formatPrivateOrganization } from '@/database/format/Organization';

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const Cookies = await cookies();
	const sessionCookie = Cookies.get('session');
	const session = await decrypt(sessionCookie?.value ?? '');

	const user = await getUserFromSession(session, { membership: true });
	const organizations = (
		await getOrganizationWhereMemberBelongs(session.user_id, { organization: true, user: true })
	).map((member) => {
		return formatPrivateOrganization<object>(member.organization);
	});

	if (!user) return null;
	return (
		<UserProvider user={formatPrivateUser<{ membership: true }>(user)}>
			<MembershipProvider>
				<OrganizationsProvider organizations={organizations}>
					<Sidebar />

					<main className={styles.main}>{children}</main>
				</OrganizationsProvider>
			</MembershipProvider>
		</UserProvider>
	);
}
