import { getEventById } from '@/database/Event';
import { formatPublicEvent } from '@/database/format/Event';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { event_id } = await params;

		const event = await getEventById(event_id, {});

		if (event == null) throw ERRORS_DETAILS.event_does_not_exists();

		const event_value = await getEventById(event_id, { organization: true });
		if (event_value === null) throw ERRORS_DETAILS.event_does_not_exists();

		return NextResponse.json(formatPublicEvent(event_value));
	});
}
