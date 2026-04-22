import { deleteAccount } from '@/database/users/deleteUser';
import { getUserByFortyTwoUserId } from '@/database/users/getUser';
import { deleteCookie } from '@/lib/cookie';
import { decrypt } from '@/lib/session';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		const session = await decrypt(req.cookies.get('session')?.value);
		const value = await getUserByFortyTwoUserId(session.user_id);
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
		await deleteCookie('session');
		const user = await getUserByFortyTwoUserId(session.user_id);
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
