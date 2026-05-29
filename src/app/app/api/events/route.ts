import { EventFormatting } from '@/database/event/createEvent';
import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		const from = req.nextUrl.searchParams.get('from');
		const to = req.nextUrl.searchParams.get('to');
		const limit = req.nextUrl.searchParams.get('limit');
		let limitValue = 20;
		if (limit != null)
			limitValue = Number(limit);
		if (limitValue > 100)
			limitValue = 100;
		if (from == null || to == null)
			return new NextResponse('Error empty fields', {
			status: 401,
		});
		const cookie = req.cookies.get('session');
		await decrypt(cookie?.value);
		const value = await prisma.event.findMany({
			take: limitValue,
			include: {
				author: {
					include: { memberships: true }
				},
				registered: true,
			},
			where: {
				start_at: {
					gte : new Date(from),
				},
				end_at: {
					lte : new Date(to),
				}
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
		const row = await prisma.event.delete({
			where: {
				id : body.id,
			},
			include: {
				registered: true,
			}
		})
		return NextResponse.json(row);
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
		const row = await prisma.event.create({
			data: {
				author_id: session.user_id,
				title: body.title,
				description: body.description,
				max_inscription: body.max_inscription,
				start_at: body.start_at,
				end_at: body.end_at,
			},
			include: {
				author: {
					include: {
						memberships: true
					}
				},
				registered: true,
			}
		})
		return NextResponse.json(EventFormatting(row));
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to delete event.', {
			status: 500,
		});
	}
} 