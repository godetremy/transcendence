import { prisma } from '@/database/prisma/prisma';
import { agentFormatting } from '@/database/users/getAgent';
import { decrypt } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		const cookie = req.cookies.get('session');
		await decrypt(cookie?.value);
		const list = await prisma.users.findMany({
			where: {
				is_agent_verified: null,
			},
		});
		const users = list.map(agentFormatting);
		return NextResponse.json(users);
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to find agent.', {
			status: 500,
		});
	}
}
