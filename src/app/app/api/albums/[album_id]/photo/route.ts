import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getThrowableSession } from '@/lib/session';
import { parseBody } from '@/utils/parsing';
import { UploadPhotoSchema } from '@/schema/PhotoSchema';
import { getAlbumById } from '@/database/Album';
import { getUserById } from '@/database/User';
import { PublicPhoto } from '@/types/Photo';
import { uploadPhoto } from '@/database/Photo';

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ album_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { album_id } = await params;
		const session = await getThrowableSession(req);
		const body = await parseBody<PublicPhoto>(req, UploadPhotoSchema);

		const album = await getAlbumById(album_id, {});
		if (!album) throw ERRORS_DETAILS.album_does_not_exist();

		const user = await getUserById(session.user_id, {});
		if (!user) throw ERRORS_DETAILS.user_does_not_exist();

		await uploadPhoto(album_id, user.id, body.path);

		return NextResponse.json({ success: true });
	});
}
