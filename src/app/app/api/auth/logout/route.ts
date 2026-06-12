import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { unsetSession } from '@/lib/session';
import { errorHandler } from '@/utils/errors';

export async function GET(): Promise<NextResponse> {
	return errorHandler(async () => {
		await unsetSession();
		return redirect('/app/login');
	});
}
