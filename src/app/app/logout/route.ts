import { deleteCookie } from '@/lib/cookie';
import { decrypt } from '@/lib/session';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		await decrypt(req.cookies.get('session')?.value);
		await deleteCookie('session');
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse(`Failed to logout. Please try again later.`, {
			status: 500,
		});
	}
	return redirect('/app/login');
}
