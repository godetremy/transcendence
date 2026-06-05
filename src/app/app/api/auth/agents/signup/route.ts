import { createUserAgent } from '@/database/users/createUser';
import { isAccountExistByMail } from '@/database/users/isAccountExist';
import { createAndSetSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { parseBody } from '@/utils/body';
import { AgentsSignUpParametersSchema } from '@/schema/AgentsSignUpParametersSchema';
import { AgentsSignUpParameters } from '@/types/AgentsSignUpParameters';
import { apiError, ERRORS_DETAILS, serverError } from '@/utils/errors';

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const body = await parseBody<AgentsSignUpParameters>(req, AgentsSignUpParametersSchema);

		if (await isAccountExistByMail(body.mail)) return apiError(ERRORS_DETAILS.account_already_exists());

		const user = await createUserAgent(body.mail, body.password);

		await createAndSetSession({
			user_id: user.id,
			is_agent: user.is_agent,
			is_agent_verified: user.is_agent_verified,
		});
	} catch (error: unknown) {
		if (typeof error === 'string') return apiError(error, 400);
		return serverError(error);
	}
	return NextResponse.json({ success: true });
}
