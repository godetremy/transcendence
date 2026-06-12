import { countEventsByFilter, createEvent, deleteEventById, getEventsByFilter } from '@/database/Event';
import { decrypt } from '@/lib/session';
import { ClubAndSubscribeEventParamSchema, CreateEventSchema, IdEventParamSchema } from '@/schema/EventSchema';
import { apiError, serverError } from '@/utils/errors';
import { getDateParams } from '@/utils/date';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { getSortingParams } from '@/utils/sorting';
import { NextRequest, NextResponse } from 'next/server';
import { parseBody, parseParams } from '@/utils/parsing';
import { ClubAndSubscribeEvent, CreateOrUpdateEventType, IdEvent } from '@/types/Event';
import { formatPublicEvent } from '@/database/format/Event';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		const params = req.nextUrl.searchParams;

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;

		const data = parseParams<ClubAndSubscribeEvent>(params, ClubAndSubscribeEventParamSchema);
		const date = getDateParams(params);
		const sorting = getSortingParams(params);
		const pagination = getPaginationParams(params);

		const count = await countEventsByFilter();
		const value = await getEventsByFilter({ author: true }, { ...data, user_id }, date, sorting, pagination);

		return NextResponse.json(generatePaginationResponse(value.map(formatPublicEvent), count, pagination));
	} catch (err: unknown) {
		if (typeof err === 'string') return apiError(err, 400);
		return serverError(err);
	}
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
	try {
		const cookie = req.cookies.get('session');
		await decrypt(cookie?.value);

		const data = await parseBody<IdEvent>(req, IdEventParamSchema);

		await deleteEventById(data.event_id, { registered: true, image_album: true });

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		if (typeof err === 'string') return apiError(err, 400);
		return serverError(err);
	}
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const cookie = req.cookies.get('session');
		const session = await decrypt(cookie?.value);

		const data = await parseBody<CreateOrUpdateEventType>(req, CreateEventSchema);

		await createEvent(data, session.user_id, { author: true });

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		if (typeof err === 'string') return apiError(err, 400);
		return serverError(err);
	}
}
