import { Prisma } from '@/database/prisma/generated/client';
import { getOrganizationMemberByFilter } from '@/database/OrganizationMembers';
import { ERRORS_DETAILS } from '@/utils/errors';
import { getOrganizationById } from '@/database/Organization';

const NULL_PERMISSIONS = (org_id: string): Prisma.organization_permissionGetPayload<object> => ({
	id: 'null',
	name: 'NOT SET',
	organization_id: org_id,
	description: null,
	event_create: false,
	event_update: false,
	event_delete: false,
	service_create: false,
	service_update: false,
	service_delete: false,
	album_create: false,
	album_update: false,
	album_delete: false,
	members_invite: false,
	members_manage: false,
	organization_update_info: false,
	organization_manage: false,
	organization_manage_permission: false,
	created_at: new Date(),
	update_at: new Date(),
});

const FULL_PERMISSIONS = (org_id: string): Prisma.organization_permissionGetPayload<object> => ({
	id: 'owner',
	name: 'Owner',
	organization_id: org_id,
	description: 'Full access to all organization details.',
	event_create: true,
	event_update: true,
	event_delete: true,
	service_create: true,
	service_update: true,
	service_delete: true,
	album_create: true,
	album_update: true,
	album_delete: true,
	members_invite: true,
	members_manage: true,
	organization_update_info: true,
	organization_manage: true,
	organization_manage_permission: true,
	created_at: new Date(),
	update_at: new Date(),
});

const getUserOrganizationPermission = async (
	user: Prisma.usersGetPayload<Prisma.usersDefaultArgs>,
	organization_id: string
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

	if (!organization_member) throw ERRORS_DETAILS.member_not_in_organization();
	if (organization_member.approved == false) throw ERRORS_DETAILS.member_not_in_organization();

	return organization_member.organization_permission ?? NULL_PERMISSIONS(organization_member.organization_id);
};

const checkIsUserGlobalAdmin = (user: Prisma.usersGetPayload<Prisma.usersDefaultArgs>): boolean => {
	if (!user.admin) throw ERRORS_DETAILS.permission_denied();
	return true;
};

export { checkIsUserGlobalAdmin, getUserOrganizationPermission };
