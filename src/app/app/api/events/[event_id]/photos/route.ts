import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { rm } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { accessSync } from 'node:fs';

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const cookie = req.cookies.get('session');
		await decrypt(cookie?.value);

		const { event_id } = await params;
		const body = await req.json();

		if (body.name == null)
			return new NextResponse('Error, name not found.', {
				status: 404,
			});

		try {
			accessSync(`imageStore/events/${event_id}/${body.name}`);

			await prisma.image_album.delete({
				where: {
					image_path: `imageStore/events/${event_id}/${body.name}`,
				},
			});

			await rm(`imageStore/events/${event_id}/${body.name}`);
			return NextResponse.json({ success: true });
		} catch {
			throw ERRORS_DETAILS.file_not_found();
		}
	});
}
