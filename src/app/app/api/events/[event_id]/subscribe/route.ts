import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ event_id: string }> }): Promise<NextResponse> {
	try {
		const { event_id } = await params;
		const cookie = req.cookies.get('session');
		const session = await decrypt(cookie?.value);
		const value = await prisma.event.update({
			include: {
				registered: {
				},
			},
			where: {
				id: event_id,
			},
			data: {
				registered : {
					create : {
						user_id: session.user_id,
					}
				}
			}
		});
		return NextResponse.json(value);
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to subscribe to event.', {
			status: 500,
		});
	}
}