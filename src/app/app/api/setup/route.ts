import { NextRequest, NextResponse } from 'next/server';
import { existsSync, writeFileSync } from 'node:fs';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import path from 'path';
import { checkIsUserGlobalAdmin } from '@/utils/permission';
import { getUserFromSession } from '@/database/User';
import { getSession } from '@/lib/session';

export function PUT(req: NextRequest) {
	return errorHandler(async () => {
		const session = await getSession(req);
		if (!session) throw ERRORS_DETAILS.session_expired();
		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.permission_denied();
		checkIsUserGlobalAdmin(user);
		const uri = path.resolve(process.cwd(), '.init_done');
		if (!existsSync(uri)) writeFileSync(uri, 'ok', 'utf-8');
		return NextResponse.json({ success: true });
	});
}
