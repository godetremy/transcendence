import { countUsersByFilter, createAgentsUser, existUserByMail } from '@/database/User';
import { createAndSetSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { parseBody } from '@/utils/parsing';
import { AgentsSignUpParametersSchema } from '@/schema/AgentsSignUpParametersSchema';
import { AgentsSignUpParameters } from '@/types/AgentsSignUpParameters';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { setCsrfCookie } from '@/lib/csrf';

export async function POST(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const body = await parseBody<AgentsSignUpParameters>(req, AgentsSignUpParametersSchema);
		let user;

		if (await existUserByMail(body.mail)) throw ERRORS_DETAILS.already_exists('Ce compte');

		const total = await countUsersByFilter({});
		if (total === 0) user = await createAgentsUser(body.mail, body.password, total === 0, true);
		else user = await createAgentsUser(body.mail, body.password, total === 0);

		await createAndSetSession({
			user_id: user.id,
			agent: user.agent,
			agent_verified: user.agent_verified,
		});

		await setCsrfCookie();

		return NextResponse.json({ success: true });
	});
}
