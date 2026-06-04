import { prisma } from '@/database/prisma/prisma';
import { createSession } from '@/lib/session';
import { cookies } from 'next/headers';
import * as bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const body = await req.json();
		if (body.email == null || body.password == null)
			return NextResponse.json({ message: 'Error, fields not set' }, { status: 400 });

		const row = await prisma.users.findFirst({
			where: { mail: body.email },
		});
		if (row == null || row.password == null)
			return NextResponse.json({ message: 'Error, agent account not found ' }, { status: 404 });

		const result = await bcrypt.compare(row.password, row.password);
		if (result == false) return NextResponse.json({ message: 'Error, password not good' }, { status: 400 });

		const session = await createSession({
			user_id: row.id,
			is_agent: row.is_agent,
			is_agent_verified: row.is_agent_verified,
		});

		const cookieStore = await cookies();

		cookieStore.set('session', session.body, {
			httpOnly: true,
			secure: true,
			expires: session.expirationDate,
			sameSite: 'lax',
			path: '/',
		});
	} catch (error: unknown) {
		return NextResponse.json({ message: error instanceof Error ? error.message : 'Unknown type' }, { status: 500 });
	}
	return NextResponse.json({ message: 'Succeed to sign in account' }, { status: 200 });
}
