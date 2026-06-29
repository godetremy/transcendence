import { countOrganizationFollowersByFilter } from '@/database/OrganizationFollowers';
import { errorHandler } from '@/utils/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const count = await countOrganizationFollowersByFilter({ organization_id: org_id });

		return NextResponse.json({ success: true, number: count });
	});
}
