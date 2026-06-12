import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '@/utils/errors';

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const cookie = req.cookies.get('session');
		const session = await decrypt(cookie?.value);

		const { event_id } = await params;

		const formData = await req.formData();
		if (formData == null)
			return new NextResponse('Error, formData not found.', {
				status: 404,
			});

		const file = formData.get('file') as File;
		const name = formData.get('name') as string;

		const buffer = Buffer.from(await file.arrayBuffer());
		await mkdir(`imageStore/events/${event_id}`, { recursive: true });
		await writeFile(`imageStore/events/${event_id}/${name}`, buffer);

		const value = await prisma.event.update({
			include: {
				image_album: {},
			},
			where: {
				id: event_id,
			},
			data: {
				image_album: {
					create: {
						image_path: `imageStore/events/${event_id}/${name}`,
						upload_user_id: session.user_id,
					},
				},
			},
		});
		return NextResponse.json(value);
	});
}
