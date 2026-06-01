import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { access } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	try {
		const { event_id } = await params;
		const cookie = req.cookies.get('session');
		const session = await decrypt(cookie?.value);

		const body = await req.json();

		try {
			await access(`imageStore/events/${event_id}/${body.name}`);
		} catch (error: unknown) {
			console.error(error);
			return new NextResponse('Error, image not found.', {
				status: 404,
			});
		}
		const value = await prisma.image_album.update({
			where: {
				image_path: `imageStore/events/${event_id}/${body.name}`,
			},
			include: {
				image_report: true,
			},
			data: {
				image_report : {
					create: {
						signaling_id : session.user_id,
						reason: body.reason,
					}
				}
			}
		});
		return NextResponse.json(value);
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse('Error, failed to download image.', {
			status: 500,
		});
	}
}
