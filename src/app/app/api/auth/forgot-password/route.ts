import { decodePasswordResetToken, generatePasswordResetToken } from '@/lib/password';
import { ForgotPasswordParametersSchema } from '@/schema/ForgotPasswordParametersSchema';
import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '@/utils/errors';
import { parseBody, parseParams } from '@/utils/parsing';
import { ForgotPasswordParameters } from '@/types/ForgotPasswordParameters';
import { getUserByMail, updateUserPassword } from '@/database/User';
import { sendMail } from '@/lib/email';
import ForgotPasswordMail from '@/mail/ForgotPassword';
import { ForgotPasswordEditParameters } from '@/types/ForgotPasswordEditParameters';
import { ForgotPasswordEditParametersSchema } from '@/schema/ForgotPasswordEditParametersSchema';
import { ForgotPasswordTokenParameters } from '@/types/ForgotPasswordTokenParameters';
import { ForgotPasswordTokenParametersSchema } from '@/schema/ForgotPasswordTokenParametersSchema';

export async function GET(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const parameters = parseParams<ForgotPasswordTokenParameters>(
			req.nextUrl.searchParams,
			ForgotPasswordTokenParametersSchema
		);
		await decodePasswordResetToken(parameters.token);

		return NextResponse.json({ success: true });
	});
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const body = await parseBody<ForgotPasswordParameters>(req, ForgotPasswordParametersSchema);

		const user = await getUserByMail(body.mail, {});

		if (user !== null) {
			const token = await generatePasswordResetToken(user.id);

			sendMail({
				to: [body.mail],
				content: ForgotPasswordMail(token),
			});
		}

		return NextResponse.json({ success: true });
	});
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const body = await parseBody<ForgotPasswordEditParameters>(req, ForgotPasswordEditParametersSchema);
		const payload = await decodePasswordResetToken(body.token);

		await updateUserPassword(payload.id, body.password);

		return NextResponse.json({ success: true });
	});
}
