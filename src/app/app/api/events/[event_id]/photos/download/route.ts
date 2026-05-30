import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ event_id: string }> }): Promise<NextResponse> {
	try {
		const { event_id } = await params;
		const cookie = req.cookies.get('session');
		const session = await decrypt(cookie?.value);
		
		const formData = await req.formData();
		const file = formData.get("file") as File;
		const name = formData.get("name") as string;

		const buffer = Buffer.from(await file.arrayBuffer());
		await mkdir(`imageStore/events/${event_id}`, { recursive: true });
		await writeFile(`imageStore/events/${event_id}/${name}`, buffer);

		const value = await prisma.event.update({
			include: {
				image_event: {
				},
			},
			where: {
				id: event_id,
			},
			data: {
				image_event: {
					create: {
						image_path: `imageStore/events/${event_id}/${name}`,
						upload_user_id: session.user_id,
					},
				},
			},
		});
		return NextResponse.json(value);
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to download image.', {
			status: 500,
		});
	}
}