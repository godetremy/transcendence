import { createEvent, deleteEventById, getEventsByFilter } from '@/database/Event';
import { decrypt } from '@/lib/session';
import { ClubAndSubscribeEventParamSchema, CreateEventSchema, IdEventParamSchema } from '@/schema/EventForm';
import { apiError, serverError } from '@/utils/errors';
import { getDateParams } from '@/utils/date';
import { getPaginationParams } from '@/utils/pagination';
import { getSortingParams } from '@/utils/sorting';
import { NextRequest, NextResponse } from 'next/server';
import { parseBody, parseParams } from '@/utils/parsing';
import { ClubAndSubscribeEvent, CreateEventType, IdEvent } from '@/types/Event';
import { EventFormatting } from '@/utils/formatting';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		const params = req.nextUrl.searchParams;

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;

		const data = parseParams<ClubAndSubscribeEvent>(params, ClubAndSubscribeEventParamSchema);
		const date = getDateParams(params);
		const sorting = getSortingParams(params);
		const pagination = getPaginationParams(params);

		const value = await getEventsByFilter({ author: true }, { ...data, user_id }, date, sorting, pagination);

		const events = value.map(EventFormatting);
		return NextResponse.json(events);
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

		deleteEventById(data.event_id, { registered: true, image_album: true });

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

		const data = await parseBody<CreateEventType>(req, CreateEventSchema);

		createEvent(data, session.user_id, { author: true });

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		if (typeof err === 'string') return apiError(err, 400);
		return serverError(err);
	}
}
