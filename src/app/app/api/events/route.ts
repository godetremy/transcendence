import { getEventsByFilter } from '@/database/Event';
import { EventFormatting } from '@/database/event/createEvent';
import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { ClubEventParamSchema, CreateEventSchema } from '@/schema/EventForm';
import { apiError, serverError } from '@/utils/errors';
import { getDateParams } from '@/utils/date';
import { getPaginationParams } from '@/utils/pagination';
import { getSortingParams } from '@/utils/sorting';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		const params = req.nextUrl.searchParams;
		
		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;

		const fields = ClubEventParamSchema.safeParse({
			club: params.get('club'),
			subscribe: params.get('subscribe'),
		});

		if (!fields.success) {
			console.log(fields);
			return new NextResponse(fields.error.message[0], {
				status: 401,
			});
		}
		
		const date = getDateParams(params);
		const sorting = getSortingParams(params);
		const pagination = getPaginationParams(params);
		
		const value = await getEventsByFilter({...fields.data, user_id}, date, sorting, pagination);
		
		const events = await Promise.all(value.map(EventFormatting));
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

		const body = await req.json();

		if (body.id == null)
			return new NextResponse('Error, id not found.', {
				status: 404,
			});

		await prisma.event.delete({
			where: {
				id: body.id,
			},
			include: {
				registered: true,
				image_album: true,
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

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const cookie = req.cookies.get('session');
		const session = await decrypt(cookie?.value);

		const body = await req.json();

		const fields = CreateEventSchema.safeParse({
			title: body.title,
			description: body.description,
			start_at: body.start_at,
			end_at: body.end_at,
			max_inscription: body.max_inscription,
		});
		if (!fields.success) {
			console.error(fields.error.issues[0].message);
			return new NextResponse(fields.error.issues[0].message, {
				status: 401,
			});
		}

		await prisma.event.create({
			data: {
				author_id: session.user_id,
				title: fields.data.title,
				description: fields.data.description,
				max_inscription: fields.data.max_inscription,
				start_at: fields.data.start_at,
				end_at: fields.data.end_at,
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
		return new NextResponse('Error, failed to create event.', {
			status: 500,
		});
	}
}
