import { getUserById } from '@/database/users/getUser';
import { decrypt } from '@/lib/session';
import { isAccountExist } from '@/database/users/isAccountExist';
import { setAgentName } from '@/database/users/setAgent';
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

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const body = await req.json();
		const session = await decrypt(req.cookies.get('session')?.value);
		const status = await isAccountExist(session.user_id);
		if (!status)
			return new NextResponse(`The account not exist.`, {
				status: 400,
			});
		const value = await setAgentName(body.name);
		return NextResponse.json(value);
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse(`Failed to set name for agent. Please try again later.`, {
			status: 500,
		});
	}
}
