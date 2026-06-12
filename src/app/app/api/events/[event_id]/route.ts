import { getEventById, UpdateEvent } from '@/database/Event';
import { EditEventSchema } from '@/schema/EventSchema';
import { CreateOrUpdateEventType } from '@/types/Event';
import { apiError, ERRORS_DETAILS, serverError } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	try {
		const { event_id } = await params;

		const event = await getEventById(event_id, { registered: true, image_album: true });
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
		const body = await parseBody<CreateOrUpdateEventType>(req, EditEventSchema);

		await UpdateEvent(body, event_id, {});
		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		if (typeof err === 'string') return apiError(err, 400);
		return serverError(err);
	}
}
