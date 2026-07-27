import { getESClient } from '@/database/prisma/elasticSearch';
import { getThrowableSession } from '@/lib/session';
import { AppLogSchema } from '@/schema/AppLogSchema';
import { errorHandler } from '@/utils/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const session = await getThrowableSession(req);

		const payload = AppLogSchema.parse(await req.json());

		const document = {
			...payload,
			timestamp: payload.timestamp ?? new Date().toISOString(),
			user_id: session.user_id,
		};

		const client = getESClient();
		await client.index({
			index: 'app-logs',
			document,
		});

		return new NextResponse(null, { status: 204 });
	});
}
