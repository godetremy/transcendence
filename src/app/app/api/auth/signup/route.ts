import { createAgentsUser, existUserByMail } from '@/database/User';
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

		const user = await createAgentsUser(body.mail, body.password);

		await createAndSetSession({
			user_id: user.id,
			is_agent: user.is_agent,
			is_agent_verified: user.is_agent_verified,
		});
		return NextResponse.json({ success: true });
	});
}
