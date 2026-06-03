import { prisma } from '@/database/prisma/prisma';
import { agentFormatting } from '@/database/users/agentFormatting';
import { decrypt } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		const cookie = req.cookies.get('session');
		await decrypt(cookie?.value);

		let limit = Number(req.nextUrl.searchParams.get('limit'));
		if (limit <= 0 || limit > 20)
			limit = 20;
		let page = Number(req.nextUrl.searchParams.get('page'));
		if (page < 0)
			return new NextResponse('Error: page must be a positive number.', {
				status: 400,
			});
		const list = await prisma.users.findMany({
			take: limit,
			where: {
				is_agent_verified: null,
			},
			skip: limit * page,
		});

		return NextResponse.json(list.map(agentFormatting));
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to find agent.', {
			status: 500,
		});
	}
}
