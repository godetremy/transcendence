import { NextResponse } from 'next/server';
import { unsetSession } from '@/lib/session';
import { errorHandler } from '@/utils/errors';

export async function POST(): Promise<NextResponse> {
	return errorHandler(async () => {
		await unsetSession();
		return NextResponse.json({ success: true });
	});
}
