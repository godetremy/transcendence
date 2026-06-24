import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { getFortyTwoMe, getFortyTwoOauthToken } from '@/rest/fortytwo';
import { createAndSetSession } from '@/lib/session';
import { createOrUpdateStudentUser } from '@/database/User';
import { errorHandler } from '@/utils/errors';
import { FortyTwoOauthToken } from '@/types/fortytwo/FortyTwoOauthToken';
import { FortyTwoCursusUserDetails } from '@/types/fortytwo/FortyTwoCursusUserDetails';

export async function GET(request: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const code: string | null = request.nextUrl.searchParams.get('code');
		if (code === null) return redirect('/app/login');

		const authorization: FortyTwoOauthToken = await getFortyTwoOauthToken(code);
		const me: FortyTwoCursusUserDetails = await getFortyTwoMe(authorization.access_token);

		/*if ((await existUserByMail(me.email)) == true) throw ERRORS_DETAILS.account_exist_with_mail();*/
		const user = await createOrUpdateStudentUser(me, authorization);

		await createAndSetSession({
			user_id: user.id,
			agent: user.agent,
			agent_verified: user.agent_verified,
		});
		return redirect('/app/home');
	});
}
