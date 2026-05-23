import { decrypt } from '@/lib/session';
import { SessionPayload } from '@/types/session/SessionPayload';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server';

const ignorePath = ['/app/api/auth/oauth'];

function isPathIgnored(path: string): boolean {
	if (!path.startsWith('/app')) return true;
	for (const ignored of ignorePath) {
		if (path.startsWith(ignored)) return true;
	}
	return false;
}

async function getSession(cookie: RequestCookie | undefined): Promise<SessionPayload | null> {
	try {
		if (cookie === undefined) return null;
		const session = await decrypt(cookie.value);
		if (Date.now() / 1000 >= session.exp) return null;
		return session;
	} catch (err: unknown) {
		console.error(err);
		return null;
	}
}

export default async function proxy(req: NextRequest) {
	if (isPathIgnored(req.nextUrl.pathname)) {
		return NextResponse.next();
	}

	const session = await getSession(req.cookies.get('session'));

	if (req.nextUrl.pathname === '/app') {
		if (session !== null) return NextResponse.redirect(new URL('/app/home', req.nextUrl));
		return NextResponse.redirect(new URL('/app/login', req.nextUrl));
	}
	if (req.nextUrl.pathname.startsWith('/app/login')) {
		if (session !== null) return NextResponse.redirect(new URL('/app/home', req.nextUrl));
		return NextResponse.next();
	}

	if (session === null) return NextResponse.redirect(new URL('/app/login', req.nextUrl));

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
