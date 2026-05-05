import { getUserByFortyTwoUserId } from '@/database/users/getUser';
import { decrypt } from '@/lib/session';
import { redirect } from 'next/navigation';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		const session = await decrypt(req.cookies.get('session')?.value);
		if (session == null) return redirect('/app/login/');
		const value = await getUserByFortyTwoUserId(session.user_id);
		return NextResponse.json(value);
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse(`Failed to login. Please try again later.`, {
			status: 500,
		});
	}
}
