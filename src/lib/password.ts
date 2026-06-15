import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { JWTPasswordResetPayload, PasswordResetPayload } from '@/types/session/PasswordResetPayload';
import { ERRORS_DETAILS } from '@/utils/errors';

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

const encrypt = async (payload: JWTPasswordResetPayload): Promise<string> => {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(payload.exp)
		.sign(encodedKey);
};

const generatePasswordResetToken = async (id: string) => {
	const expirationDate = Date.now() + 10 * 60 * 1000;

	return encrypt({
		exp: expirationDate,
		iat: Date.now(),
		iss: 'BDE-42',
		id,
	});
};

const decodePasswordResetToken = async (session: string): Promise<PasswordResetPayload> => {
	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: ['HS256'],
		});
		if (payload.exp === undefined || Date.now() >= payload.exp) throw '';
		return payload as JWTPasswordResetPayload;
	} catch {
		throw ERRORS_DETAILS.session_expired();
	}
};

export { generatePasswordResetToken, decodePasswordResetToken };
