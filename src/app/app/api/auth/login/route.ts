import { createAndSetSession } from '@/lib/session';
import * as bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getUserByMail } from '@/database/User';
import { parseBody } from '@/utils/parsing';
import { AgentsSignInParametersSchema } from '@/schema/AgentsSignInParametersSchema';
import { AgentsSignInParameters } from '@/types/AgentsSignInParameters';

export async function POST(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const body = await parseBody<AgentsSignInParameters>(req, AgentsSignInParametersSchema);

		const user = await getUserByMail(body.mail, {});

		if (user == null) throw ERRORS_DETAILS.invalid_mail_password();
		if (user.password == null) throw ERRORS_DETAILS.password_not_set();

		const password_ok = await bcrypt.compare(body.password, user.password);
		if (!password_ok) throw ERRORS_DETAILS.invalid_mail_password();

		await createAndSetSession({
			user_id: user.id,
			is_agent: user.is_agent,
			is_agent_verified: user.is_agent_verified,
		});

		return NextResponse.json({ success: true }, { status: 200 });
	});
}
