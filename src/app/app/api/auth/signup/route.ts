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
			email: body.mail,
			password: body.password,
			passwordCheck: body.password,
		});

		if (!fields.success)
			return NextResponse.json(
				{
					message: fields.error.issues[0].message,
				},
				{ status: 400 }
			);

		const exist = await isAccountExistByMail(body.mail);
		if (exist) return NextResponse.json({ message: 'This account already exist.' }, { status: 400 });

		const user_id = await createUserAgent(body.password, body.mail);

		const session = await createSession({ user_id });

		const cookieStore = await cookies();

		cookieStore.set('session', session.body, {
			httpOnly: true,
			secure: true,
			expires: session.expirationDate,
			sameSite: 'lax',
			path: '/',
		});

		return NextResponse.json({ message: 'Account created !' }, { status: 201 });
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse(`Failed to create account. Try again :(`, {
			status: 500,
		});
	}
}
