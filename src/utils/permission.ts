import { Prisma } from '@/database/prisma/generated/client';
import { getOrganizationMemberByFilter } from '@/database/OrganizationMembers';
import { ERRORS_DETAILS } from '@/utils/errors';
import { getOrganizationById } from '@/database/Organization';
import { FULL_PERMISSIONS, NULL_PERMISSIONS } from '@/const/permission';

const getUserOrganizationPermission = async (
	user: Prisma.usersGetPayload<Prisma.usersDefaultArgs>,
	organization_id: string,
	check_approve: boolean = false
): Promise<Prisma.organization_permissionGetPayload<object>> => {
	const organization = await getOrganizationById(organization_id, {});
	if (!organization) throw ERRORS_DETAILS.organization_does_not_exist();

	if (user.admin) return FULL_PERMISSIONS(organization.id);
	if (organization.verified == null || !organization.verified) throw ERRORS_DETAILS.organization_does_not_verified();
	if (organization.owner_id === user.id) return FULL_PERMISSIONS(organization.id);

	const organization_member = await getOrganizationMemberByFilter(
		{ user_id: user.id, organization_id: organization_id },
		{ organization_permission: true, organization: true }
	);

	if (organization_member == null) throw ERRORS_DETAILS.member_not_in_organization();
	if (check_approve == true && organization_member.approved == false)
		throw ERRORS_DETAILS.member_not_in_organization();

	return organization_member.organization_permission ?? NULL_PERMISSIONS(organization_member.organization_id);
};

const checkIsUserGlobalAdmin = (user: Prisma.usersGetPayload<Prisma.usersDefaultArgs>): boolean => {
	if (!user.admin) throw ERRORS_DETAILS.permission_denied();
	return true;
};

export { checkIsUserGlobalAdmin, getUserOrganizationPermission };
