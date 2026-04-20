import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const user = await prisma.user.create({
			data: {
				username: body.username,
				email: body.email,
				password: body.password,
				member_card: body.member_card,
			},
		});

		return NextResponse.json(user, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: String(error) }, { status: 404 });
	}
}
