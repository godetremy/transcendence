import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getThrowableSession } from '@/lib/session';
import { getUserById } from '@/database/User';
import { getAlbumById } from '@/database/Album';
import { deleteReports, getReportById, manageReports } from '@/database/PhotoReports';
import { PublicFormatPhotoReports } from '@/database/format/Photo_reports';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ album_id: string; report_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { album_id, report_id } = await params;
		const session = await getThrowableSession(req);

		const user = await getUserById(session.user_id, {});
		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();

		const album = await getAlbumById(album_id, {});
		if (album == null) throw ERRORS_DETAILS.album_does_not_exists();

		const report = await getReportById(report_id, {});
		if (!report) throw ERRORS_DETAILS.report_does_not_exists();

		return NextResponse.json(PublicFormatPhotoReports(report));
	});
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ album_id: string; report_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { album_id, report_id } = await params;
		const session = await getThrowableSession(req);

		const user = await getUserById(session.user_id, {});
		if (!user) throw ERRORS_DETAILS.user_does_not_exist();
		if (!user.admin) throw ERRORS_DETAILS.permission_denied();

		const album = getAlbumById(album_id, {});
		if (!album) throw ERRORS_DETAILS.album_does_not_exist();

		const report = await getReportById(report_id, {});
		if (!report) throw ERRORS_DETAILS.report_does_not_exist();

		await manageReports(report_id);

		return NextResponse.json({ success: true });
	});
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ album_id: string; report_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { album_id, report_id } = await params;
		const session = await getThrowableSession(req);

		const user = await getUserById(session.user_id, {});
		if (!user) throw ERRORS_DETAILS.user_does_not_exist();
		if (!user.admin) throw ERRORS_DETAILS.permission_denied();

		const album = getAlbumById(album_id, {});
		if (!album) throw ERRORS_DETAILS.album_does_not_exist();

		const report = await getReportById(report_id, {});
		if (!report) throw ERRORS_DETAILS.report_does_not_exist();

		await deleteReports(report_id, {});

		return NextResponse.json({ success: true });
	});
}
