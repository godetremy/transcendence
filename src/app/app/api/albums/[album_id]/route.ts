import { getAlbumById } from "@/database/Album";
import { formatPublicAlbum } from "@/database/format/Album";
import { getUserById } from "@/database/User";
import { getThrowableSession } from "@/lib/session";
import { errorHandler, ERRORS_DETAILS } from "@/utils/errors";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ album_id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const {album_id} = await params;
		const session = await getThrowableSession(req);
		
		const user = await getUserById(session.user_id, {});
		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();

		const album = await getAlbumById( album_id, {});
		if (album == null) throw ERRORS_DETAILS.album_does_not_exists();

		return NextResponse.json(formatPublicAlbum(album));
	});
}