import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getUploadRequest } from '@/database/UploadRequest';
import { jwtVerify } from 'jose';

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function GET(req: NextRequest) {
	return errorHandler(async () => {
		const uploadToken = req.headers.get('x-upload-token');
		const uploadId = req.headers.get('x-upload-id');

		if (!uploadToken || !uploadId) throw ERRORS_DETAILS.permission_denied();

		const { payload } = await jwtVerify(uploadToken, encodedKey, { algorithms: ['HS256'] });
		if (payload.upload_id !== uploadId) throw ERRORS_DETAILS.permission_denied();

		const uploadReq = await getUploadRequest(uploadId);
		if (!uploadReq) throw ERRORS_DETAILS.permission_denied();

		return NextResponse.json({ success: true });
	});
}
