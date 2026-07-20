import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { deletePhoto, getPhotoById } from '@/database/Photo';
import { getThrowableSession } from '@/lib/session';
import { getUserById } from '@/database/User';
import { formatPublicPhoto } from '@/database/format/Photo';
import { getAlbumById } from '@/database/Album';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ album_id: string; photo_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { album_id, photo_id } = await params;
		const session = await getThrowableSession(req);

		const photo = await getPhotoById(photo_id);
		if (!photo) throw ERRORS_DETAILS.does_not_exists('Cet album');

		const album = await getAlbumById(album_id, {});
		if (!album) throw ERRORS_DETAILS.does_not_exists('Cet album');

		const user = await getUserById(session.user_id, {});
		if (!user) throw ERRORS_DETAILS.does_not_exists('cet utilisateur');

		return NextResponse.json(formatPublicPhoto(photo));
	});
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ album_id: string; photo_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { album_id, photo_id } = await params;
		const session = await getThrowableSession(req);

		const photo = await getPhotoById(photo_id);
		if (!photo) throw ERRORS_DETAILS.does_not_exists('Cet album');

		const album = await getAlbumById(album_id, {});
		if (!album) throw ERRORS_DETAILS.does_not_exists('Cet album');

		const user = await getUserById(session.user_id, {});
		if (!user) throw ERRORS_DETAILS.does_not_exists('Cet utilisateur');
		if (!user.admin) throw ERRORS_DETAILS.permission_denied();

		await deletePhoto(photo_id);

		return NextResponse.json({ success: true });
	});
}
