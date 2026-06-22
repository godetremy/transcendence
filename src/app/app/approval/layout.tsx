import { UserProvider } from '@/contexts/UserContext';
import { getUserFromSession } from '@/database/User';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { formatPrivateUser } from '@/database/format/User';

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const Cookies = await cookies();
	const sessionCookie = Cookies.get('session');
	const session = await decrypt(sessionCookie?.value ?? '');
	const user = await getUserFromSession(session, { membership: true });

	if (!user) return null;
	return <UserProvider user={formatPrivateUser<{ membership: true }>(user)}>{children}</UserProvider>;
}
