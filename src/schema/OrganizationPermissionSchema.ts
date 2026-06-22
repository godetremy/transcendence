import * as z from 'zod';

export const OrganizationPermissionSchema = z.object({
	name: z.string().trim(),
	description: z.string().trim().nullable(),
	event_create: z.boolean(),
	event_update: z.boolean(),
	event_delete: z.boolean(),
	service_create: z.boolean(),
	service_update: z.boolean(),
	service_delete: z.boolean(),
	album_create: z.boolean(),
	album_update: z.boolean(),
	album_delete: z.boolean(),
	members_invite: z.boolean(),
	members_manage: z.boolean(),
	organization_update_info: z.boolean(),
	organization_manage: z.boolean(),
	organization_manage_permission: z.boolean(),
});
