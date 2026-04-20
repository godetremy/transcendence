import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { getFortyTwoMe, getFortyTwoOauthToken } from '@/rest/fortytwo';
import { prisma } from '@/database/prisma/prisma';

async function is_SetAccount(mail: string): Promise<boolean> {
	const result = await prisma.users.findUnique({
		where: {
			mail: mail,
		},
	});
	if (result == null) return false;
	return true;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
	const params: URLSearchParams = request.nextUrl.searchParams;
	const code: string | null = params.get('code');

	if (code === null) return redirect('/app/login');
	try {
		const authorization = await getFortyTwoOauthToken(code);
		const me = await getFortyTwoMe(authorization.access_token);
		const status = await is_SetAccount(me.email);
		if (status == false) {
			const user = await prisma.users.create({
				data: {
					is_agent: false,
					mail: me.email,
					first_name: me.first_name,
					last_name: me.last_name,
					full_name: me.usual_full_name,
					oauth_fortytwo: {
						create: {
							access_token: authorization.access_token,
							refresh_token: authorization.refresh_token,
						},
					},
					memberships: {
						create: {},
					},
				},
			});
			console.log(user);
		}
		console.log('the status is ', status);
		return new NextResponse(`${me.displayname} is connected`);
	} catch (err: unknown) {
		console.log(err);
		return new NextResponse(`Failed to login. Please try again later.`, {
			status: 500,
		});
	}
}
