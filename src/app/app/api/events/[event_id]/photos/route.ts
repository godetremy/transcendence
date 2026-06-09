import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { access, rm } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	try {
		const cookie = req.cookies.get('session');
		await decrypt(cookie?.value);

		const { event_id } = await params;
		const body = await req.json();

		if (body.name == null)
			return new NextResponse('Error, name not found.', {
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
		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to download image.', {
			status: 500,
		});
	}
}
