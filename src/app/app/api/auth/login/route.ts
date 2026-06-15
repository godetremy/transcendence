import { createAndSetSession } from '@/lib/session';
import * as bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getUserByMail } from '@/database/User';
import { parseBody } from '@/utils/parsing';
import { AgentsLoginParametersSchema } from '@/schema/AgentsLoginParametersSchema';
import { AgentsLoginParameters } from '@/types/AgentsLoginParameters';
import { checkTotp } from '@/database/TwoFactorAuth';

export async function POST(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const body = await parseBody<AgentsLoginParameters>(req, AgentsLoginParametersSchema);

		const user = await getUserByMail(body.mail, { two_factor_auth: true });

		if (user == null) throw ERRORS_DETAILS.invalid_mail_password();
		if (user.password == null) throw ERRORS_DETAILS.password_not_set();

		const password_ok = await bcrypt.compare(body.password, user.password);
		if (!password_ok) throw ERRORS_DETAILS.invalid_mail_password();

		console.log(user.two_factor_auth);
		if (user.two_factor_auth) {
			if (body.method) {
				switch (body.method) {
					case 'mail':
						throw ERRORS_DETAILS.two_factor_auth_not_implemented();
					case 'totp':
						if (!body.code) throw ERRORS_DETAILS.missing_parameter('code');
						if (!user.two_factor_auth.totp_enabled)
							throw ERRORS_DETAILS.two_factor_auth_method_not_enabled();
						if (!(await checkTotp(user.two_factor_auth, body.code)))
							throw ERRORS_DETAILS.invalid_totp_code();
						break;
					default:
						throw ERRORS_DETAILS.two_factor_auth_method_not_enabled();
				}
			} else throw ERRORS_DETAILS.two_factor_auth_required();
		}

		await createAndSetSession({
			user_id: user.id,
			agent: user.agent,
			agent_verified: user.agent_verified,
		});

		return NextResponse.json({ success: true }, { status: 200 });
	});
}
