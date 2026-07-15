import { deleteAlbumById, getAlbumById, UpdateAlbum } from '@/database/Album';
import { formatPublicAlbum } from '@/database/format/Album';
import { getUserById } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { UpdateAlbumSchema } from '@/schema/AlbumSchema';
import { UpdateAlbumType } from '@/types/album';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import { getUserOrganizationPermission } from '@/utils/permission';
import { NextRequest, NextResponse } from 'next/server';
import { getEventByAlbumId } from '@/database/Event';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ album_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { album_id } = await params;
		const session = await getThrowableSession(req);

		const user = await getUserById(session.user_id, {});
		if (user == null) throw ERRORS_DETAILS.does_not_exists('Ce compte');;

		const album = await getAlbumById(album_id, {});
		if (album == null) throw ERRORS_DETAILS.does_not_exists('Cet album');

		return NextResponse.json(formatPublicAlbum(album));
	});
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ album_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { album_id } = await params;

		const session = await getThrowableSession(req);
		const user = await getUserById(session.user_id, {});
		if (user == null) throw ERRORS_DETAILS.does_not_exists('Ce compte');;

		const checkAlbum = await getAlbumById(album_id, {
			events: { include: { organization: true } },
			services: { include: { organization: true } },
		});
		if (checkAlbum == null) throw ERRORS_DETAILS.does_not_exists('Cet album');

		if (checkAlbum.events?.organization_id != null) {
			const user_permission = await getUserOrganizationPermission(user, checkAlbum.events.organization_id, true);
			if (!user_permission.album_update) throw ERRORS_DETAILS.permission_denied();
		} else if (checkAlbum.services?.organization_id != null) {
			const user_permission = await getUserOrganizationPermission(
				user,
				checkAlbum.services.organization_id,
				true
			);
			if (!user_permission.album_update) throw ERRORS_DETAILS.permission_denied();
		} else throw ERRORS_DETAILS.does_not_exists('Cette organisation');

		const body = await parseBody<UpdateAlbumType>(req, UpdateAlbumSchema);

		const album = await UpdateAlbum(body, album_id, {});
		if (album == null) throw ERRORS_DETAILS.does_not_exists('Cet album');

		return NextResponse.json(formatPublicAlbum(album));
	});
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ album_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { album_id } = await params;
		const session = await getThrowableSession(req);

		const event = await getEventByAlbumId(album_id, {});
		if (!event) throw ERRORS_DETAILS.event_does_not_exist();

		const user = await getUserById(session.user_id, {});
		if (!user) throw ERRORS_DETAILS.user_does_not_exist();

		const permission = await getUserOrganizationPermission(user, event.organization_id, true);
		if (!permission.album_delete) throw ERRORS_DETAILS.permission_denied();

		await deleteAlbumById(album_id, {});

		return NextResponse.json({ success: true });
	});
}
