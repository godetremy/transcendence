import { formatOrganizationMembers } from '@/database/format/OrganizationMembers';
import { getOrganizationById } from '@/database/Organization';
import { countOrganizationMembersByFilter, CreateOrganizationMembersWithOrganizationId, getOrganizationMembersByFilter } from '@/database/OrganizationMembers';
import { OrganizationMemberSchema } from '@/schema/OrganizationMembersSchema';
import { CreateInviteOrganizationMembersType } from '@/types/OrganizationMembers';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { parseBody } from '@/utils/parsing';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const Pagination = getPaginationParams(req.nextUrl.searchParams);

		const number = await countOrganizationMembersByFilter({});
		const list = await getOrganizationMembersByFilter({ organization_id: id }, {}, Pagination);

		return NextResponse.json(
			generatePaginationResponse(list.map(formatOrganizationMembers), number, Pagination)
		);
	});
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;

		const body = await parseBody<CreateInviteOrganizationMembersType>(req, OrganizationMemberSchema);

		const organization = await getOrganizationById(id, {});

		if (organization == null) throw ERRORS_DETAILS.organization_does_not_exist();

		const members = await CreateOrganizationMembersWithOrganizationId(body, organization.id);

		if (members == null) throw ERRORS_DETAILS.permission_denied();

		return NextResponse.json(formatOrganizationMembers(members));
	});
}
