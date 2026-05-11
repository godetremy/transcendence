'use server';
import { createUserAgent } from '@/database/users/createUser';
import { isAccountExistByMail } from '@/database/users/isAccountExist';
import { createSession } from '@/lib/session';
import { SignupFormSchema } from '@/schema/SignupForm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function signUpAgent(email: string, password: string): Promise<NextResponse> {
	try {
		const fields = SignupFormSchema.safeParse({
			email: email,
			password: password,
			passwordCheck: password,
		});

		if (!fields.success)
			return NextResponse.json(
				{
					message: fields.error.issues[0].message,
				},
				{ status: 400 }
			);

		const exist = await isAccountExistByMail(email);
		if (exist) return NextResponse.json({ message: 'This account already exist.' }, { status: 400 });

		const user_id = await createUserAgent(password, email);

		const session = await createSession({ user_id });

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
		return new NextResponse(`Failed to create account. Try again :(`, {
			status: 500,
		});
	}
	return redirect('/app/home/');
}
