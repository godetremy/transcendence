import { createAgentsUser } from '@/database/User';
import { createOrganization } from '@/database/Organization';
import { inviteMemberToOrganization } from '@/database/OrganizationMembers';
import { CreateOrganizationPermissionWithOrganizationId } from '@/database/OrganizationPermission';

const organizationName = 'Oh le bordel...';
const membersTotal = 100;
const ownerId = '2e965a40-6a7d-4f19-aaa2-5b184411c691';

const now = Date.now();

(async () => {
	const org = await createOrganization({
		name: organizationName,
		owner_id: ownerId,
	});

	const perm = await CreateOrganizationPermissionWithOrganizationId(
		{
			album_create: false,
			album_delete: false,
			album_update: false,
			description: 'Sans droit en gros',
			event_create: false,
			event_delete: false,
			event_update: false,
			members_invite: false,
			members_manage: false,
			name: 'Esclave',
			organization_manage: false,
			organization_manage_permission: false,
			organization_update_info: false,
			service_create: false,
			service_delete: false,
			service_update: false,
		},
		org.id
	);

	await inviteMemberToOrganization(org.id, ownerId, perm.id, true);

	for (let i = 1; i < membersTotal; i++) {
		const member = await createAgentsUser(`agentsuser${now}_member${i}@demo.com`, 'test.123', false, true);
		await inviteMemberToOrganization(org.id, member.id, perm.id, true);
		console.log(`Created member (${i + 1} / ${membersTotal})`);
	}
	process.exit();
})();
