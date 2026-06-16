import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getOrganizationById } from '@/database/Organization';
import { formatPrivateOrganization } from '@/database/format/Organization';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const org = await getOrganizationById(id, {});
		if (org == null) throw ERRORS_DETAILS.organization_does_not_exist();

		const formatedOrg = formatPrivateOrganization(org);
		return NextResponse.json(formatedOrg);
	});
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {

}

export async function DELETE(req: NextRequest): Promise<NextResponse> {}
