import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	try {
		const { event_id } = await params;

		const cookie = req.cookies.get('session');
		const session = await decrypt(cookie?.value);

		await prisma.registered_event.delete({
			where: {
				registered_event_id: event_id,
				user_id: session.user_id,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to unsubscribe to event.', {
			status: 500,
		});
	}
}
