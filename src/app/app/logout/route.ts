import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		await decrypt(req.cookies.get('session')?.value);
		const cookieStore = await cookies();
		const cookie = cookieStore.get('session');
		if (cookie != null) {
			cookieStore.set('session', cookie.value, {
				httpOnly: true,
				secure: true,
				expires: Date.now(),
				sameSite: 'lax',
				path: '/',
			});
		}
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse(`Failed to logout. Please try again later.`, {
			status: 500,
		});
	}
	return redirect('/app/login');
}
