import { prisma } from '@/database/prisma/prisma';
import hashPassword from '@/database/users/createUser';
import { decryptEmailToken } from '@/lib/EmailToken';
import { newPasswordForm } from '@/schema/ForgotPasswordForm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const Token = req.cookies.get('EmailToken');

		const decyptedToken = await decryptEmailToken(Token?.value);

		const body = await req.json();

		const field = newPasswordForm.safeParse({
			password: body.password,
			passwordCheck: body.passwordCheck,
		});

		if (!field.success) {
			return NextResponse.json(
				{
					message: field.error.issues[0].message,
				},
				{ status: 400 }
			);
		}

		const hashed = await hashPassword(field.data.password);

		await prisma.users.update({
			where: { mail: decyptedToken.email },
			data: { password: hashed },
		});

		return NextResponse.json(
			{ message: 'passwordChanged', redirect: `/app/login/` },
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
