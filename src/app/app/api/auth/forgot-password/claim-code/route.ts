import { prisma } from '@/database/prisma/prisma';
import { decryptEmailToken } from '@/lib/EmailToken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const Token = req.cookies.get('EmailToken');

		const decyptedToken = await decryptEmailToken(Token?.value);

		const body = await req.json();

		const receivedCode = body.code;

		const user = await prisma.users.findUnique({
			where: {
				mail: decyptedToken.email,
			},
		});

		console.log(user?.id);
		if (receivedCode === user?.code) {
			return NextResponse.json(
				{ message: 'perfect code', redirect: `/app/login/agents/forgot-password/${user?.id}` },
				{
					status: 200,
				}
			);
		}

		return NextResponse.json(
			{ message: 'code not found' },
			{
				status: 404,
			}
		);
	} catch (err: unknown) {
		return NextResponse.json(
			{ message: err },
			{
				status: 500,
			}
		);
	}
}
