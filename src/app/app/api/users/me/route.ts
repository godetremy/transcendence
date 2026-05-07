import { deleteAccount } from '@/database/users/deleteUser';
import { getUserById } from '@/database/users/getUser';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		const session = await decrypt(req.cookies.get('session')?.value);
		const value = await getUserById(session.user_id);
		return NextResponse.json(value);
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse(`Failed to login. Please try again later.`, {
			status: 500,
		});
	}
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
	try {
		const session = await decrypt(req.cookies.get('session')?.value);
		const cookieStore = await cookies();
		const cookie = cookieStore.get('session');
		if (cookie != null) {
			cookieStore.set('session', cookie.value, {
				httpOnly: true,
				secure: true,
				expires: Date.now(),
				sameSite: 'lax',
				path: '/',
			});
		}
		const user = await getUserById(session.user_id);
		if (user !== null) {
			deleteAccount(user);
			return NextResponse.json(user);
		}
		return NextResponse.json(session);
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse(`Failed to login. Please try again later.`, {
			status: 500,
		});
	}
}
