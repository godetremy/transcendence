import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { decrypt, parseUserId } from '@/lib/session';
import { verify, generateSecret } from 'otplib';
import { saveTotpSecret, toggleTotp } from '@/database/TwoFactorAuth';
import { getUserById } from '@/database/User';
import { parseBody } from '@/utils/parsing';
import { TwoFactorAuthTotpBodySchema } from '@/schema/TwoFactorAuthTotpBodySchema';
import { TwoFactorAuthTotpBody } from '@/types/TwoFactorAuthTotpBody';

export function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	return errorHandler(async () => {
		const { id } = await params;
		const session = await decrypt(req.cookies.get('session')?.value);
		const user_id = parseUserId(id, session);

		if (!user_id.is_me) throw ERRORS_DETAILS.permission_denied();

		const user = await getUserById(user_id.id, { two_factor_auth: true });

		if (!user) throw ERRORS_DETAILS.permission_denied();
		if (user.two_factor_auth && user.two_factor_auth.totp_enabled) throw ERRORS_DETAILS.permission_denied();

		const secret = generateSecret();
		const two_factor_auth = await saveTotpSecret(user_id.id, secret);

		if (!two_factor_auth) throw ERRORS_DETAILS.failed_to_configure_totp();

		return NextResponse.json({
			success: true,
			uri: `otpauth://totp/BDE42Angouleme:${user?.mail}?secret=${secret}&issuer=${encodeURIComponent('BDE 42 Angoulême')}`,
		});
	});
}

export function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	return errorHandler(async () => {
		const body = await parseBody<TwoFactorAuthTotpBody>(req, TwoFactorAuthTotpBodySchema);
		const { id } = await params;
		const session = await decrypt(req.cookies.get('session')?.value);
		const user_id = parseUserId(id, session);

		if (!user_id.is_me) throw ERRORS_DETAILS.permission_denied();

		const user = await getUserById(user_id.id, {
			two_factor_auth: true,
		});
		if (!user) throw ERRORS_DETAILS.account_does_not_exists();
		if (!user.two_factor_auth || !user.two_factor_auth.totp_secret)
			throw ERRORS_DETAILS.two_factor_auth_not_configured();

		const result = await verify({ secret: user.two_factor_auth.totp_secret, token: body.code });

		if (!result.valid) throw ERRORS_DETAILS.invalid_totp_code();

		await toggleTotp(user_id.id, body.enable);

		return NextResponse.json({
			success: true,
		});
	});
}
