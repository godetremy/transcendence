import { countEventsByFilter, createEvent, getEventsByFilter } from "@/database/Event";
import { formatPrivateEvent } from "@/database/format/Event";
import { getOrganizationById } from "@/database/Organization";
import { getOrganizationMemberByFilter } from "@/database/OrganizationMembers";
import { getOrganizationPermissionById } from "@/database/OrganizationPermission";
import { getUserById } from "@/database/User";
import { decrypt } from "@/lib/session";
import { CreateEventSchema } from "@/schema/EventSchema";
import { CreateOrUpdateEventType } from "@/types/Event";
import { getDateParams } from "@/utils/date";
import { errorHandler, ERRORS_DETAILS } from "@/utils/errors";
import { generatePaginationResponse, getPaginationParams } from "@/utils/pagination";
import { parseBody } from "@/utils/parsing";
import { getSortingParams } from "@/utils/sorting";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ org_id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const searchParams = req.nextUrl.searchParams;
		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});
		const organization = await getOrganizationById(org_id, {});
		
		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();
		if (organization == null) throw ERRORS_DETAILS.organization_does_not_exist();

		if (user.admin == false && organization.owner_id != user_id) {
			const member = await getOrganizationMemberByFilter({organization_id: org_id, user_id: user_id}, {});
			if (member == null) throw ERRORS_DETAILS.member_not_in_organization();
			if (member.approved == false || member.permission_id == null) throw ERRORS_DETAILS.member_not_in_organization();
		}

		const date = getDateParams(searchParams);
		const sorting = getSortingParams(searchParams);
		const pagination = getPaginationParams(searchParams);

		const count = await countEventsByFilter();
		const value = await getEventsByFilter({ organization: true }, org_id , date, sorting, pagination);

		return NextResponse.json(generatePaginationResponse(value.map(formatPrivateEvent), count, pagination));
	});
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ org_id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});
		const organization = await getOrganizationById(org_id, {});
		
		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();
		if (organization == null) throw ERRORS_DETAILS.organization_does_not_exist();

		if (user.admin == false && organization.owner_id != user_id) {
			const member = await getOrganizationMemberByFilter({organization_id: org_id, user_id: user_id}, {});
			if (member == null) throw ERRORS_DETAILS.member_not_in_organization();
			if (member.approved == false || member.permission_id == null) throw ERRORS_DETAILS.member_not_in_organization();
			
			const permission = await getOrganizationPermissionById(member.permission_id, member.organization_id, {});
			if (permission?.event_create == null) throw ERRORS_DETAILS.permission_denied();
		}
		
		const data = await parseBody<CreateOrUpdateEventType>(req, CreateEventSchema);
		await createEvent(data, org_id, { });

		return NextResponse.json({ success: true });
	});
}