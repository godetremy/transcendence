import { EventFormatting } from '@/database/event/createEvent';
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
		await decrypt(cookie?.value);
		const value = await prisma.event.findFirst({
			include: {
				registered: {},
				image_event: {},
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

export async function POST(req: NextRequest, { params }: { params: Promise<{ event_id: string }> }): Promise<NextResponse> {
	try {
		const { event_id } = await params;
		const cookie = req.cookies.get('session');
		await decrypt(cookie?.value);
		const body = await req.json();
		const row = await prisma.event.update({
			where: {
				id: event_id,
			},
			data: {
				title: body.title,
				description: body.description,
				max_inscription: body.max_inscription,
				start_at: body.start_at,
				end_at: body.end_at,
			},
			include: {
				author: {
					include: {
						memberships: true,
					},
				},
				registered: true,
			},
		});
		return NextResponse.json(EventFormatting(row));
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to delete event.', {
			status: 500,
		});
	}
}
