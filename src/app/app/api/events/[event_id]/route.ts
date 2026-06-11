import { getEventById } from '@/database/Event';
import { prisma } from '@/database/prisma/prisma';
import { EditEventSchema } from '@/schema/EventForm';
import { apiError, ERRORS_DETAILS, serverError } from '@/utils/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	try {
		const { event_id } = await params;

		const event = getEventById(event_id, { registered: true, image_album: true });
		if (event === null) return apiError(ERRORS_DETAILS.event_does_not_exists(), 404);

		return NextResponse.json(event);
	} catch (err: unknown) {
		return serverError(err);
	}
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	try {
		const { event_id } = await params;
		const body = await req.json();

		const fields = EditEventSchema.safeParse({
			title: body.title,
			description: body.description,
			max_inscription: body.max_inscription,
			start_at: body.start_at,
			end_at: body.end_at,
		});
		if (!fields.success) {
			console.error(fields.error.issues[0].message);
			return new NextResponse(fields.error.issues[0].message, {
				status: 401,
			});
		}
		await prisma.event.update({
			where: {
				id: event_id,
			},
			data: {
				title: fields.data.title,
				description: fields.data.description,
				max_inscription: fields.data.max_inscription,
				...(fields.data.start_at && { start_at: fields.data.start_at }),
				...(fields.data.end_at && { end_at: fields.data.end_at }),
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
		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to delete event.', {
			status: 500,
		});
	}
}
