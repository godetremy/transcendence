import { deletef, get, patch, post } from '@/lib/fetcher';
import { PaginationResponse } from '@/types/PaginationResponse';
import { CreateOrganizationPermissionType, OrganizationPermissionDetails } from '@/types/OrganizationPermissionDetails';
import { OrganizationMembers } from '@/types/OrganizationMembers';
import { GlobalQueryClient } from '@/lib/fetcher/queryClient';
import { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { PublicOrganizationFollowers } from '@/types/OrganizationFollowers';

const getOrganizationMembers = (
	org_id: string
): UseInfiniteQueryOptions<PaginationResponse<OrganizationMembers<{ user: true; permission: true }>>> => ({
	queryFn: ({ pageParam = 1 }) =>
		get<PaginationResponse<OrganizationMembers<{ user: true; permission: true }>>>(
			`/organization/${org_id}/members?page=${pageParam}`
		),
	queryKey: ['organization', org_id, 'members'],
	initialPageParam: 1,
	getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
});

const getOrganizationFollowers = (
	org_id: string
): UseInfiniteQueryOptions<PaginationResponse<PublicOrganizationFollowers<{ user: true }>>, Error> => ({
	queryFn: ({ pageParam = 1 }) =>
		get<PaginationResponse<PublicOrganizationFollowers<{ user: true }>>>(
			`/organization/${org_id}/followers?page=${pageParam}`
		),
	queryKey: ['organization', org_id, 'members'],
	initialPageParam: 1,
	getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
});

const getOrganizationPermission = (
	org_id: string
): UseQueryOptions<PaginationResponse<OrganizationPermissionDetails>, Error> => ({
	queryFn: () => get<PaginationResponse<OrganizationPermissionDetails>>(`/organization/${org_id}/permission`),
	queryKey: ['organization', org_id, 'permissions'],
});

const getOrganizationMemberById = (
	org_id: string,
	user_id: string
): UseQueryOptions<OrganizationMembers<{ user: true; permission: true }>, Error> => ({
	queryFn: () => get<OrganizationMembers>(`/organization/${org_id}/members/${user_id}`),
	queryKey: ['organization', org_id, 'member', user_id],
});

const updateOrganizationUserPermission = (
	org_id: string,
	user_id: string
): UseMutationOptions<PaginationResponse<OrganizationPermissionDetails>, Error, { perm_id: string }> => ({
	mutationFn: ({ perm_id }: { perm_id: string }) =>
		post<PaginationResponse<OrganizationPermissionDetails>>(`/organization/${org_id}/members/${user_id}`, {
			permissions: perm_id,
		}),
	onSuccess: (data) => {
		GlobalQueryClient.setQueryData(['organization', org_id, 'member', user_id], data);
	},
});

const deleteOrganizationMember = (
	org_id: string,
	user_id: string
): UseMutationOptions<OrganizationMembers<{ user: true; permission: true }>, Error> => ({
	mutationFn: () => deletef<OrganizationMembers>(`/organization/${org_id}/members/${user_id}`, Object),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'members'] });
	},
});

const inviteOrganizationMembers = (
	org_id: string
): UseMutationOptions<
	OrganizationMembers<{ user: true; permission: true }[]>,
	Error,
	{ permission_id: string; members: string[] }
> => ({
	mutationFn: ({ permission_id, members }: { permission_id: string; members: string[] }) =>
		post<OrganizationMembers>(`/organization/${org_id}/members/invite`, {
			permission_id: permission_id,
			users_id: members.join(','),
		}),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'members'] });
	},
});

const createOrganizationPermission = (
	org_id: string
): UseMutationOptions<OrganizationPermissionDetails, Error, { permission: CreateOrganizationPermissionType }> => ({
	mutationFn: ({ permission }: { permission: CreateOrganizationPermissionType }) =>
		post<OrganizationPermissionDetails>(`/organization/${org_id}/permission`, permission),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'permissions'] });
	},
});

const updateOrganizationPermission = (
	org_id: string,
	perm_id: string
): UseMutationOptions<OrganizationPermissionDetails, Error, { permission: CreateOrganizationPermissionType }> => ({
	mutationFn: ({ permission }: { permission: CreateOrganizationPermissionType }) =>
		patch<OrganizationPermissionDetails>(`/organization/${org_id}/permission/${perm_id}`, permission),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'permissions', perm_id] });
	},
});

export {
	getOrganizationMembers,
	getOrganizationPermission,
	getOrganizationMemberById,
	updateOrganizationUserPermission,
	deleteOrganizationMember,
	inviteOrganizationMembers,
	createOrganizationPermission,
	updateOrganizationPermission,
	getOrganizationFollowers,
};
