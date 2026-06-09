import { isAccountExistByMail } from '@/database/users/isAccountExist';
import { sendEmailCode } from '@/email/sendEmail';
import { createEmailToken } from '@/lib/EmailToken';
import { forgotPasswordForm } from '@/schema/ForgotPasswordForm';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const body = await req.json();

		const field = forgotPasswordForm.safeParse({
			email: body.email,
		});

		if (!field.success) {
			return NextResponse.json(
				{
					message: field.error.issues[0].message,
				},
				{ status: 400 }
			);
		}

		const exist = await isAccountExistByMail(field.data.email);

		if (!exist) {
			return NextResponse.json(
				{
					message: `Error: Email not in database`,
				},
				{ status: 400 }
			);
		}

		sendEmailCode(body.email);

		const Token = await createEmailToken({ email: field.data.email });

		const cookieStore = await cookies();

		cookieStore.set('EmailToken', Token.body, {
			httpOnly: true,
			secure: true,
			expires: Token.expirationDate,
			sameSite: 'lax',
			path: '/',
		});

		return NextResponse.json(
			{ message: `Success`, redirect: '/app/login/agents/forgot-password/claim-code' },
			{
				status: 200,
			}
		);
	} catch (err: unknown) {
		return NextResponse.json(
			{ message: err },
			{
				status: 500,
			}
		);
	}
}
