import { getEventById, UpdateEvent } from '@/database/Event';
import { EditEventSchema } from '@/schema/EventSchema';
import { CreateOrUpdateEventType } from '@/types/Event';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { event_id } = await params;

		const event = await getEventById(event_id, { registered: true, image_album: true });
		if (event === null) throw ERRORS_DETAILS.event_does_not_exists();

		return NextResponse.json(event);
	});
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { event_id } = await params;
		const body = await parseBody<CreateOrUpdateEventType>(req, EditEventSchema);

		await UpdateEvent(body, event_id, {});
		return NextResponse.json({ success: true });
	});
}
