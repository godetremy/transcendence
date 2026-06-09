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

		const register = await prisma.registered_event.findMany({
			include: {
				event: true,
			},
			where: {
				registered_event_id: event_id,
			},
		});

		if (register != null && register[0] != null) {
			console.log(register[0]);
			if (register[0].event) {
				const max = register[0].event?.max_inscription;
				if (register.length >= max)
					return new NextResponse('Error, to many subscribe.', {
						status: 400,
					});
			}
		}

		await prisma.event.update({
			include: {
				registered: true,
			},
			where: {
				id: event_id,
			},
			data: {
				registered: {
					create: {
						user_id: session.user_id,
					},
				},
			},
		});
		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to subscribe to event.', {
			status: 500,
		});
	}
}
