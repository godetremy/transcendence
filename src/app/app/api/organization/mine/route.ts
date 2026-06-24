import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '@/utils/errors';
import { getThrowableSession } from '@/lib/session';
import { formatPrivateOrganization } from '@/database/format/Organization';
import { getOrganizationWhereMemberBelongs } from '@/database/OrganizationMembers';
export function GET(req: NextRequest) {
	return errorHandler(async () => {
		const session = await getThrowableSession(req);

		const list = await getOrganizationWhereMemberBelongs(session.user_id, { organization: true });

		return NextResponse.json(
			list.map((member) => {
				return formatPrivateOrganization<object>(member.organization);
			})
		);
	});
}
