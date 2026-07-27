import { createAndSetSession } from '@/lib/session';
import * as bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getUserByMail } from '@/database/User';
import { parseBody } from '@/utils/parsing';
import { AgentsLoginParametersSchema } from '@/schema/AgentsLoginParametersSchema';
import { AgentsLoginParameters } from '@/types/AgentsLoginParameters';
import { checkTotp } from '@/database/TwoFactorAuth';
import { setCsrfCookie } from '@/lib/csrf';
import { countRateLimitLoginByIp, countRateLimitLoginByUserId, createRateLimitLogin } from '@/database/ratelimitLogin';

const MAX_ATTEMPTS_PER_ACCOUNT = 5;
const MAX_ATTEMPTS_PER_IP = 20;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const body = await parseBody<AgentsLoginParameters>(req, AgentsLoginParametersSchema);
		const ip = req.headers.get('x-forwarded-for') ?? 'unknown';

		const user = await getUserByMail(body.mail, { two_factor_auth: true });

		const ipAttempts = await countRateLimitLoginByIp(ip, false, WINDOW_MS);
		if (ipAttempts >= MAX_ATTEMPTS_PER_IP) {
			throw ERRORS_DETAILS.too_many_attempts();
		}

		if (user) {
			const accountAttempts = await countRateLimitLoginByUserId(user.id, false, WINDOW_MS);
			if (accountAttempts >= MAX_ATTEMPTS_PER_ACCOUNT) {
				throw ERRORS_DETAILS.too_many_attempts();
			}
		}

		const DUMMY_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8G6wG6r9U2p8XdG.6ub2u8QY6l5J6O';
		const password_ok = await bcrypt.compare(body.password, user?.password ?? DUMMY_HASH);

		if (!user || !user.password || !password_ok) {
			if (user) await createRateLimitLogin(user.id, ip, false);
			throw ERRORS_DETAILS.invalid_mail_password();
		}

		if (user.two_factor_auth) {
			if (body.method) {
				switch (body.method) {
					case 'mail':
						throw ERRORS_DETAILS.two_factor_auth_not_implemented();
					case 'totp':
						if (!body.code) {
							await createRateLimitLogin(user.id, ip, false);
							throw ERRORS_DETAILS.missing_parameter('code');
						}
						if (!user.two_factor_auth.totp_enabled) {
							await createRateLimitLogin(user.id, ip, false);
							throw ERRORS_DETAILS.two_factor_auth_method_not_enabled();
						}
						if (!(await checkTotp(user.two_factor_auth, body.code))) {
							await createRateLimitLogin(user.id, ip, false);
							throw ERRORS_DETAILS.invalid_totp_code();
						}
						break;
					default:
						await createRateLimitLogin(user.id, ip, false);
						throw ERRORS_DETAILS.two_factor_auth_method_not_enabled();
				}
			} else {
				await createRateLimitLogin(user.id, ip, false);
				throw ERRORS_DETAILS.two_factor_auth_required();
			}
		}

		await createRateLimitLogin(user.id, ip, true);

		await createAndSetSession({
			user_id: user.id,
			agent: user.agent,
			agent_verified: user.agent_verified,
		});

		await setCsrfCookie();

		return NextResponse.json({ success: true }, { status: 200 });
	});
}
