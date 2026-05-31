import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { access, rm } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ event_id: string }> }): Promise<NextResponse> {
	try {
		const { event_id } = await params;
		const cookie = req.cookies.get('session');
		await decrypt(cookie?.value);
		
		const body = await req.json();

		try {
			await access(`imageStore/events/${event_id}/${body.name}`);
		} catch (error : unknown) {
			console.error(error);
			return new NextResponse('Error, image not found.', {
				status: 404,
			});
		}
		const value = await prisma.image_event.delete({
				where: {
					image_path: `imageStore/events/${event_id}/${body.name}`,
				},
			});
		await rm(`imageStore/events/${event_id}/${body.name}`);
		return NextResponse.json(value);

	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to download image.', {
			status: 500,
		});
	}
}