import { deleteAccount } from '@/database/users/deleteUser';
import { getUserByFortyTwoUserId } from '@/database/users/getUser';
import { decrypt } from '@/lib/session';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		const session = await decrypt(req.cookies.get('session')?.value);
		const user = await getUserByFortyTwoUserId(session.user_id);
		if (user != null) deleteAccount(user);
	} catch (error: unknown) {
		console.error(error);
		return NextResponse.redirect(new URL('/app/home', req.url), { status: 308 });
	}
	return redirect('/app/logout');
}
