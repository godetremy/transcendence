import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ event_id: string }> }): Promise<NextResponse> {
	try {
		const { event_id } = await params;
		const cookie = req.cookies.get('session');
		await decrypt(cookie?.value);
		const value = await prisma.event.findFirst({
			include: {
				registered: {
				},
			},
			where: {
				id: event_id,
			},
		});
		return NextResponse.json(value);
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to get event.', {
			status: 500,
		});
	}
}