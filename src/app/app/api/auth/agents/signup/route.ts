import { createUserAgent } from '@/database/users/createUser';
import { isAccountExistByMail } from '@/database/users/isAccountExist';
import { createSession } from '@/lib/session';
import { SignupFormSchema } from '@/schema/SignupForm';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const body = await req.json();
		const fields = SignupFormSchema.safeParse({
			email: body.email,
			password: body.password,
			passwordCheck: body.passwordCheck,
		});

		if (!fields.success)
			return NextResponse.json(
				{
					message: fields.error.issues[0].message,
				},
				{ status: 400 }
			);

		const exist = await isAccountExistByMail(fields.data.email);
		if (exist) return NextResponse.json({ message: 'This account already exist.' }, { status: 400 });

		const user = await createUserAgent(fields.data.email, fields.data.password);

		const session = await createSession({
			user_id: user.id,
			is_agent: user.is_agent,
			is_agent_verified: user.is_agent_verified,
		});

		const cookieStore = await cookies();

		cookieStore.set('session', session.body, {
			httpOnly: true,
			secure: true,
			expires: session.expirationDate,
			sameSite: 'lax',
			path: '/',
		});
	} catch (error: unknown) {
		console.error(error);
		return NextResponse.json(`Failed to signup account. Try again :(`, {
			status: 500,
		});
	}
	return NextResponse.json(`Succeed to sign up account`, {
		status: 200,
	});
}
