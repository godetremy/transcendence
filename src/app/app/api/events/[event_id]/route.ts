import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { EventFormSchema } from '@/schema/EventForm';
import { access, rm } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	try {
		const cookie = req.cookies.get('session');
		await decrypt(cookie?.value);
		
		const { event_id } = await params;
		if (event_id == null)
			return new NextResponse('Error, event_id not found.', {
				status: 404,
			});
		const value = await prisma.event.findFirst({
			include: {
				registered: {},
				image_album: {},
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

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	try {
		const cookie = req.cookies.get('session');
		await decrypt(cookie?.value);

		const { event_id } = await params;
		if (event_id == null)
			return new NextResponse('Error, event_id not found.', {
				status: 404,
			});

		const body = await req.json();

		const fields = EventFormSchema.safeParse({
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
		return new NextResponse('Error, failed to delete event.', {
			status: 500,
		});
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	try {
		const cookie = req.cookies.get('session');
		await decrypt(cookie?.value);

		const { event_id } = await params;
		const body = await req.json();

		if (event_id == null || body.name == null)
			return new NextResponse('Error, event_id or name not found.', {
				status: 404,
			});

		try {
			await access(`imageStore/events/${event_id}/${body.name}`);
		} catch (error: unknown) {
			console.error(error);
			return new NextResponse('Error, image not found.', {
				status: 404,
			});
		}

		await prisma.image_album.delete({
			where: {
				image_path: `imageStore/events/${event_id}/${body.name}`,
			},
		});

		await rm(`imageStore/events/${event_id}/${body.name}`);
		return NextResponse.json({success: true});
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to download image.', {
			status: 500,
		});
	}
}
