import { isAccountExist } from '@/database/users/isAccountExist';
import { setUserName } from '@/database/users/setUser';
import { decrypt } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const body = await req.json();
		const session = await decrypt(req.cookies.get('session')?.value);
		const status = await isAccountExist(session.user_id);
		if (!status)
			return new NextResponse(`The account exist.`, {
				status: 400,
			});
		const value = await setUserName(session.user_id, body.name);
		return NextResponse.json(value);
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse(`Failed to set name for agent. Please try again later.`, {
			status: 500,
		});
	}
}
