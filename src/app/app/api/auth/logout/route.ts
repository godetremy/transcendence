import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { unsetSession } from '@/lib/session';
import { serverError } from '@/utils/errors';

export async function GET(): Promise<NextResponse> {
	try {
		await unsetSession();
	} catch (err: unknown) {
		serverError(err);
	}
	return redirect('/app/login');
}
