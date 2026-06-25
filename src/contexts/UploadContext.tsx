import { SignJWT } from 'jose';
import { decrypt } from '@/lib/session';
import { UploadTokenProvider } from '@/contexts/UploadTokenContext';
import { cookies } from 'next/headers';
import { countUploadRequestForTheLastHour, createUploadRequest } from '@/database/UploadRequest';
import { ERRORS_DETAILS } from '@/utils/errors';

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function UploadProvider({ children }: { children: React.ReactNode }) {
	const Cookies = await cookies();
	const sessionCookie = Cookies.get('session');
	const session = await decrypt(sessionCookie?.value ?? '');

	const uploadCount = await countUploadRequestForTheLastHour(session.user_id);
	//if (uploadCount >= 30) throw ERRORS_DETAILS.too_many_upload();
	//TODO: Enable upload limit
	const request = await createUploadRequest(session.user_id);

	const token = await new SignJWT({ upload_id: request.id, file_id: request.file_id, user_id: session.user_id })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('1h')
		.sign(encodedKey);

	return <UploadTokenProvider token={token}>{children}</UploadTokenProvider>;
}
