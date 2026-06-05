import { createAndSetSession } from '@/lib/session';
import * as bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { apiError, ERRORS_DETAILS, serverError } from '@/utils/errors';
import { getUserByMail } from '@/database/User';
import { parseBody } from '@/utils/body';
import { AgentsSignInParametersSchema } from '@/schema/AgentsSignInParametersSchema';
import { AgentsSignInParameters } from '@/types/AgentsSignInParameters';

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const body = await parseBody<AgentsSignInParameters>(req, AgentsSignInParametersSchema);

		const user = await getUserByMail(body.mail, {});

		if (user == null) return apiError(ERRORS_DETAILS.invalid_mail_password(), 401);
		if (user.password == null) return apiError(ERRORS_DETAILS.password_not_set(), 400);

		const password_ok = await bcrypt.compare(body.password, user.password);
		if (!password_ok) return apiError(ERRORS_DETAILS.invalid_mail_password(), 401);

		await createAndSetSession({
			user_id: user.id,
			is_agent: user.is_agent,
			is_agent_verified: user.is_agent_verified,
		});
	} catch (error: unknown) {
		if (typeof error === 'string') return apiError(error, 400);
		return serverError(error);
	}
	return NextResponse.json({ success: true }, { status: 200 });
}
