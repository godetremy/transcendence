import { createUserAgent } from '@/database/users/createUser';
import { deleteAccount } from '@/database/users/deleteUser';
import { getUserById } from '@/database/users/getUser';
import { isAccountExistByMail } from '@/database/users/isAccountExist';
import { createSession, decrypt } from '@/lib/session';
import { SignupFormSchema } from '@/schema/SignupForm';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		const session = await decrypt(req.cookies.get('session')?.value);
		const value = await getUserById(session.user_id);
		return NextResponse.json(value);
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse(`Failed to login. Please try again later.`, {
			status: 500,
		});
	}
}

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

export async function DELETE(req: NextRequest): Promise<NextResponse> {
	try {
		const session = await decrypt(req.cookies.get('session')?.value);
		const cookieStore = await cookies();
		const cookie = cookieStore.get('session');
		if (cookie != null) {
			cookieStore.set('session', cookie.value, {
				httpOnly: true,
				secure: true,
				expires: Date.now(),
				sameSite: 'lax',
				path: '/',
			});
		}
		const user = await getUserById(session.user_id);
		if (user !== null) {
			deleteAccount(user);
			return NextResponse.json(user);
		}
		return NextResponse.json(session);
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse(`Failed to login. Please try again later.`, {
			status: 500,
		});
	}
}
