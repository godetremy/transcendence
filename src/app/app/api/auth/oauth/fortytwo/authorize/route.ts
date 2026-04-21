import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { getFortyTwoMe, getFortyTwoOauthToken } from '@/rest/fortytwo';
import { upsertUser } from '@/database/users/upsertUser';

export async function GET(request: NextRequest): Promise<NextResponse> {
	const params: URLSearchParams = request.nextUrl.searchParams;
	const code: string | null = params.get('code');

	if (code === null) return redirect('/app/login');
	try {
		const authorization = await getFortyTwoOauthToken(code);
		const me = await getFortyTwoMe(authorization.access_token);
		try {
			await upsertUser(me, authorization);
		} catch (err: unknown) {
			console.error(err);
			return new NextResponse(`Failed to create or update user in database. Please try again later.`, {
				status: 500,
			});
		}
		return new NextResponse(`${me.displayname} is connected`);
	} catch (err: unknown) {
		console.log(err);
		return new NextResponse(`Failed to login. Please try again later.`, {
			status: 500,
		});
	}
}
