import styles from './layout.module.scss';
import { UserProvider } from '@/contexts/UserContext';
import { getUserFromSession } from '@/database/User';
import Sidebar from '@/components/globals/Sidebar/Sidebar';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { formatPrivateUser } from '@/database/format/User';
import { MembershipProvider } from '@/components/membership/MembershipProvider/MembershipProvider';

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const Cookies = await cookies();
	const sessionCookie = Cookies.get('session');
	const session = await decrypt(sessionCookie?.value ?? '');
	const user = await getUserFromSession(session, { memberships: true });

	if (!user) return null;

	return (
		<UserProvider user={formatPrivateUser<{ memberships: true }>(user)}>
			<MembershipProvider>
				<Sidebar />

				<main className={styles.main}>{children}</main>
			</MembershipProvider>
		</UserProvider>
	);
}
