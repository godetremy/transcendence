import { NextRequest, NextResponse } from 'next/server';
import { unsetSession } from '@/lib/session';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { verifyCsrf } from '@/lib/csrf';

export async function POST(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const isValidCsrf = await verifyCsrf(req);
		if (!isValidCsrf) throw ERRORS_DETAILS.permission_denied();
		await unsetSession();
		return NextResponse.json({ success: true });
	});
}
