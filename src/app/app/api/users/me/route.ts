import { getUserById } from '@/database/users/getUser';
import { decrypt } from '@/lib/session';
import { isAccountExist } from '@/database/users/isAccountExist';
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/database/prisma/prisma';

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
		if (session.is_agent_verified == true)
			return new NextResponse(`Error session agent is verified.`, {
				status: 400,
			});
		const status = await isAccountExist(session.user_id);
		if (!status)
			return new NextResponse(`The account does not exist.`, {
				status: 400,
			});
		const value = await prisma.users.update({
			where: { id: session.user_id },
			data: {
				full_name: body.name,
				reason: body.reason,
			},
		});
		return NextResponse.json(value);
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse(`Failed to set name for agent. Please try again later.`, {
			status: 500,
		});
	}
}
