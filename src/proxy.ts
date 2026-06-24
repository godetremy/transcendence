import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { existsSync } from 'node:fs';
import path from 'path';

const ignorePath = ['/app/api/auth/'];
const ignorePathApprove = [
	'app/api/users/approval',
	'/app/approval',
	'/app/api/users/me',
	'/app/api/auth/refresh',
	'/app/api/auth/logout',
];

function checkFirstInitialization(url: string) {
	const uri = path.resolve(process.cwd(), '.init_done');
	return !existsSync(uri) && !url.startsWith('/setup') && !url.startsWith('/app/api');
}

function isPathIgnored(path: string): boolean {
	if (!path.startsWith('/app')) return true;
	for (const ignored of ignorePath) {
		if (path.startsWith(ignored)) return true;
	}
	return false;
}

function isPathIgnoredApprove(path: string): boolean {
	for (const ignored of ignorePathApprove) {
		if (path.startsWith(ignored)) {
			console.error('ignored', ignored);
			return true;
		}
	}
	return false;
}

export default async function proxy(req: NextRequest) {
	if (isPathIgnored(req.nextUrl.pathname)) {
		return NextResponse.next();
	}

	if (checkFirstInitialization(req.nextUrl.pathname)) return NextResponse.redirect(new URL('/setup', req.nextUrl));

	const session = await getSession(req);

	if (req.nextUrl.pathname === '/app') {
		if (session !== null) return NextResponse.redirect(new URL('/app/home', req.nextUrl));
		return NextResponse.redirect(new URL('/app/login', req.nextUrl));
	}
	if (req.nextUrl.pathname.startsWith('/app/login')) {
		if (session !== null) return NextResponse.redirect(new URL('/app/home', req.nextUrl));
		return NextResponse.next();
	}

	if (session === null) {
		if (req.nextUrl.pathname.startsWith('/app/api'))
			return NextResponse.json({ success: false, message: 'Not logged in' }, { status: 401 });
		return NextResponse.redirect(new URL('/app/login', req.nextUrl));
	}

	if (session.agent && (session.agent_verified === null || !session.agent_verified)) {
		if (isPathIgnoredApprove(req.nextUrl.pathname)) return NextResponse.next();
		return NextResponse.redirect(new URL('/app/approval', req.nextUrl));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
