import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getUploadRequest } from '@/database/UploadRequest';
import { jwtVerify } from 'jose';

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function GET(req: NextRequest) {
	return errorHandler(async () => {
		const uploadToken = req.headers.get('Authorization')?.replace('Bearer ', '');

		if (!uploadToken) throw ERRORS_DETAILS.permission_denied();

		const { payload } = await jwtVerify(uploadToken, encodedKey, { algorithms: ['HS256'] });

		const uploadReq = await getUploadRequest((payload as { upload_id: string }).upload_id);
		if (!uploadReq) throw ERRORS_DETAILS.permission_denied();

		return NextResponse.json({ success: true });
	});
}
