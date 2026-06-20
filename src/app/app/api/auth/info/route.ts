import { NextRequest, NextResponse } from 'next/server';
import { getThrowableSession } from '@/lib/session';
import { errorHandler } from '@/utils/errors';

export function GET(req: NextRequest) {
	return errorHandler(async () => {
		await getThrowableSession(req);
		return NextResponse.json({ success: true });
	});
}
