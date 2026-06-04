import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	try {
		const cookie = req.cookies.get('session');
		await decrypt(cookie?.value);

		const { id } = await params;

		try {
			await prisma.users.update({
				where: { id: id },
				data: { is_agent_verified: true },
			});
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError && err.code == 'P2025') {
				return NextResponse.json(
					{ success: false, message: 'User does not exist' },
					{
						status: 400,
					}
				);
			}
		}
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to set agent status.', {
			status: 500,
		});
	}
	return NextResponse.json({ success: true });
}
