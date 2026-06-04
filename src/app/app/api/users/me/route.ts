import { getUserById } from '@/database/users/getUser';
import { decrypt } from '@/lib/session';
import { isAccountExist } from '@/database/users/isAccountExist';
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/database/prisma/prisma';
import { UserFormSchema } from '@/schema/UserForm';
import { Prisma } from '@/database/prisma/generated/client';

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
		const fields = UserFormSchema.safeParse({
			mail: body.mail == null ? null : body.mail,
			first_name: body.first_name == null ? null : body.first_name,
			last_name: body.last_name == null ? null : body.last_name,
			full_name: body.full_name == null ? null : body.full_name,
			reason: body.reason == null ? null : body.reason,
			profile_picture: body.profile_picture == null ? null : body.profile_picture,
		});
		console.log(fields);
		if (fields.data == null)
			return new NextResponse(`Error fields is null.`, {
				status: 404,
			});

		const session = await decrypt(req.cookies.get('session')?.value);
		const status = await isAccountExist(session.user_id);

		if (!status)
			return new NextResponse(`The account does not exist.`, {
				status: 400,
			});

		await prisma.users.update({
			where: { id: session.user_id },
			data: {
				...(fields.data.mail && { mail: fields.data.mail }),
				...(fields.data.first_name && { first_name: fields.data.first_name }),
				...(fields.data.last_name && { last_name: fields.data.last_name }),
				...(fields.data.full_name && { full_name: fields.data.full_name }),
				...(fields.data.reason && { reason: fields.data.reason }),
				...(fields.data.profile_picture && { profile_picture: fields.data.profile_picture }),
			},
		});
		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse(`Failed to set name for agent. Please try again later.`, {
			status: 500,
		});
	}
}
