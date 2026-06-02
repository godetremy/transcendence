import { EventFormatting } from '@/database/event/createEvent';
import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { EventFormSchema, EventSearchFormSchema } from '@/schema/EventForm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		const cookie = req.cookies.get('session');
		const session = await decrypt(cookie?.value);

		const fields = EventSearchFormSchema.safeParse({
			from: req.nextUrl.searchParams.get('from'),
			to: req.nextUrl.searchParams.get('to'),
			limit: req.nextUrl.searchParams.get('limit'),
			search: req.nextUrl.searchParams.get('search'),
			club: req.nextUrl.searchParams.get('club'),
			subscribe: req.nextUrl.searchParams.get('subscribe'),
		});

		if (!fields.success)
			return new NextResponse(fields.error.message[0], {
				status: 401,
			});
		if (fields.data.limit == null) fields.data.limit = 100;
		else fields.data.limit > 0 && fields.data.limit <= 100 ? {} : (fields.data.limit = 100);

		const value = await prisma.event.findMany({
			take: fields.data.limit,
			include: {
				author: {
					include: { memberships: true },
				},
				registered: true,
				image_album: true,
			},
			where: {
				start_at: {
					gte: fields.data.from,
				},
				end_at: {
					lte: fields.data.to,
				},
				registered: {
					...(fields.data.subscribe ? { user_id: session.user_id } : {}),
				},
				author: {
					...(fields.data.club ? { full_name: fields.data.club } : {}),
				},
			},
			orderBy: {
				_relevance: {
					fields: ['title'],
					search: fields.data.search ? fields.data.search?.trim().split(/\s+/).join(' & ') : '',
					sort: 'desc',
				},
			},
		});

		const events = await Promise.all(value.map(EventFormatting));
		return NextResponse.json(events);
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to get list event.', {
			status: 500,
		});
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

		return NextResponse.json({success: true});
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

		const fields = EventFormSchema.safeParse({
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

		return NextResponse.json({success: true});
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to create event.', {
			status: 500,
		});
	}
}
