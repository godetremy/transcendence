import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	try {
		const { id } = await params;
		const cookie = req.cookies.get('session');
		await decrypt(cookie?.value);
		await prisma.users.update({
			where: { id: id },
			data: { is_agent_verified: true },
		});
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to set agent status.', {
			status: 500,
		});
	}
	return new NextResponse('Agent status set', {
		status: 200,
	});
}
