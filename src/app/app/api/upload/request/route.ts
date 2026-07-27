import { NextRequest, NextResponse } from 'next/server';
import { getThrowableSession } from '@/lib/session';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { countUploadRequestForTheLastHour, createUploadRequest } from '@/database/UploadRequest';
import { SignJWT } from 'jose';

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function POST(req: NextRequest) {
	return errorHandler(async () => {
		const session = await getThrowableSession(req);

		const uploadCount = await countUploadRequestForTheLastHour(session.user_id);
		if (uploadCount >= 20) throw ERRORS_DETAILS.too_many_upload();

		const request = await createUploadRequest(session.user_id);

		const token = await new SignJWT({ upload_id: request.id, file_id: request.file_id, user_id: session.user_id })
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime('1h')
			.sign(encodedKey);

		return NextResponse.json(
			{
				id: request.id,
				token: token,
			},
			{ status: 201 }
		);
	});
}
