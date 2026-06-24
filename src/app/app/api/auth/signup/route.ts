import { countUsersByFilter, createAgentsUser, existUserByMail } from '@/database/User';
import { createAndSetSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { parseBody } from '@/utils/parsing';
import { AgentsSignUpParametersSchema } from '@/schema/AgentsSignUpParametersSchema';
import { AgentsSignUpParameters } from '@/types/AgentsSignUpParameters';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';

export async function POST(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const body = await parseBody<AgentsSignUpParameters>(req, AgentsSignUpParametersSchema);

		if (await existUserByMail(body.mail)) throw ERRORS_DETAILS.account_already_exists();
		const total = await countUsersByFilter({});

		let user;
		if (total === 0) user = await createAgentsUser(body.mail, body.password, total === 0, true);
		else user = await createAgentsUser(body.mail, body.password, total === 0);

		await createAndSetSession({
			user_id: user.id,
			agent: user.agent,
			agent_verified: user.agent_verified,
		});
		return NextResponse.json({ success: true });
	});
}
