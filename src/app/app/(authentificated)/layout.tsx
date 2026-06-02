import './layout.scss';
import { UserProvider } from '@/contexts/UserContext';
import { getUserFromSession } from '@/database/users/getUser';
import Sidebar from '@/components/globals/Sidebar/Sidebar';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { MembershipProvider } from '@/components/membership/MembershipProvider/MembershipProvider';

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const Cookies = await cookies();
	const sessionCookie = Cookies.get('session');
	const session = await decrypt(sessionCookie?.value ?? '');
	const user = await getUserFromSession(session);

	if (!user) return null;

	return (
		<UserProvider user={user}>
			<MembershipProvider>
				<Sidebar />

				<main>{children}</main>
			</MembershipProvider>
		</UserProvider>
	);
}
