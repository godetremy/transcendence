import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { getThrowableSession } from '@/lib/session';
import { getUserById } from '@/database/User';
import { countPhotoReportsByFilter, createReport, getPhotoReportsByFilter } from '@/database/PhotoReports';
import { PrivateFormatPhotoReports } from '@/database/format/Photo_reports';
import { parseBody } from '@/utils/parsing';
import { PhotoReportsSchema } from '@/schema/PhotoReportsSchema';
import { PublicPhotoReports } from '@/types/PhotoReports';

export async function GET(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const searchParams = req.nextUrl.searchParams;

		const pagination = getPaginationParams(searchParams);
		const session = await getThrowableSession(req);
		const user = await getUserById(session.user_id, {});
		if (user == null) throw ERRORS_DETAILS.does_not_exists('Ce compte');;
		if (!user.admin) throw ERRORS_DETAILS.permission_denied();

		const count = await countPhotoReportsByFilter({});
		const value = await getPhotoReportsByFilter({}, {}, pagination);

		return NextResponse.json(generatePaginationResponse(value.map(PrivateFormatPhotoReports), count, pagination));
	});
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ album_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { album_id } = await params;
		const body = await parseBody<PublicPhotoReports>(req, PhotoReportsSchema);
		const session = await getThrowableSession(req);

		const user = await getUserById(session.user_id, {});
		if (!user) throw ERRORS_DETAILS.user_does_not_exist();

		await createReport(album_id, user.id, body.photo_id, body.reason);

		return NextResponse.json({ success: true });
	});
}
