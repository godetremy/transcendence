import { formatOrganizationMembers } from '@/database/format/OrganizationMembers';
import { getOrganizationMemberByFilter } from '@/database/OrganizationMembers';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string; user_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id, user_id } = await params;

		const value = await getOrganizationMemberByFilter({ organization_id: id, user_id: user_id }, {});

		if (value == null) throw ERRORS_DETAILS.permission_denied();
		return NextResponse.json(formatOrganizationMembers(value));
	});
}
