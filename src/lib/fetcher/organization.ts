import { deletef, get, patch, post, put } from '@/lib/fetcher';
import { PaginationResponse } from '@/types/PaginationResponse';
import { CreateOrganizationPermissionType, OrganizationPermissionDetails } from '@/types/OrganizationPermissionDetails';
import { OrganizationInvitation, OrganizationMembers } from '@/types/OrganizationMembers';
import { GlobalQueryClient } from '@/lib/fetcher/queryClient';
import {
	InfiniteData,
	QueryKey,
	UseInfiniteQueryOptions,
	UseMutationOptions,
	UseQueryOptions,
} from '@tanstack/react-query';
import { PublicOrganizationFollowers } from '@/types/OrganizationFollowers';
import { CreateOrganizationType, PrivateOrganization } from '@/types/Organization';

const getOrganizations = (): UseInfiniteQueryOptions<
	PaginationResponse<PrivateOrganization<object>>,
	Error,
	InfiniteData<PaginationResponse<PrivateOrganization<object>>>,
	QueryKey,
	number
> => ({
	queryFn: ({ pageParam }) =>
		get<PaginationResponse<PrivateOrganization<object>>>(`/organization/mine?page=${pageParam}`),
	queryKey: ['organization', 'mine'],
	initialPageParam: 1,
	getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
});

const getOrganizationInvites = (): UseInfiniteQueryOptions<
	PaginationResponse<OrganizationInvitation>,
	Error,
	InfiniteData<PaginationResponse<OrganizationInvitation>>,
	QueryKey,
	number
> => ({
	queryFn: ({ pageParam = 1 }) =>
		get<PaginationResponse<OrganizationInvitation>>(`/organization/invitation/pending?page=${pageParam}`),
	queryKey: ['organization', 'invitation', 'pending'],
	initialPageParam: 1,
	getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
});

const getPendingApproveOrganization = (): UseInfiniteQueryOptions<
	PaginationResponse<PrivateOrganization<object>>,
	Error,
	InfiniteData<PaginationResponse<PrivateOrganization<object>>>,
	QueryKey,
	number
> => ({
	queryFn: ({ pageParam = 1 }) =>
		get<PaginationResponse<PrivateOrganization<object>>>(`/organization/approve?page=${pageParam}`),
	queryKey: ['organization', 'approve'],
	initialPageParam: 1,
	getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
});

const getOrganizationMembers = (
	org_id: string
): UseInfiniteQueryOptions<
	PaginationResponse<OrganizationMembers<{ user: true; permission: true }>>,
	Error,
	InfiniteData<PaginationResponse<OrganizationMembers<{ user: true; permission: true }>>>,
	QueryKey,
	number
> => ({
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
): UseInfiniteQueryOptions<
	PaginationResponse<PublicOrganizationFollowers<{ user: true }>>,
	Error,
	InfiniteData<PaginationResponse<PublicOrganizationFollowers<{ user: true }>>>,
	QueryKey,
	number
> => ({
	queryFn: ({ pageParam = 1 }) =>
		get<PaginationResponse<PublicOrganizationFollowers<{ user: true }>>>(
			`/organization/${org_id}/followers?page=${pageParam}`
		),
	queryKey: ['organization', org_id, 'followers'],
	initialPageParam: 1,
	getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
});

const getOrganizationPermissions = (
	org_id: string
): UseInfiniteQueryOptions<
	PaginationResponse<OrganizationPermissionDetails>,
	Error,
	InfiniteData<PaginationResponse<OrganizationPermissionDetails>>,
	QueryKey,
	number
> => ({
	queryFn: ({ pageParam = 1 }) => get<PaginationResponse<OrganizationPermissionDetails>>(`/organization/${org_id}/permission?page=${pageParam}`),
	queryKey: ['organization', org_id, 'permissions'],
	initialPageParam: 1,
	getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
});

const getOrganizationMemberById = (
	org_id: string,
	user_id: string
): UseQueryOptions<OrganizationMembers<{ user: true; permission: true }>, Error> => ({
	queryFn: () => get<OrganizationMembers>(`/organization/${org_id}/members/${user_id}`),
	queryKey: ['organization', org_id, 'member', user_id],
});

const getOrganizationFollowerNumber = (
	org_id: string
): UseQueryOptions<{ success: boolean; number: number }, Error> => ({
	queryFn: () => get<{ success: boolean; number: number }>(`/organization/${org_id}/followers/number`),
	queryKey: ['organization', org_id, 'followers', 'number'],
});

const createOrganization = (): UseMutationOptions<
	PaginationResponse<OrganizationPermissionDetails>,
	Error,
	{ org: CreateOrganizationType }
> => ({
	mutationFn: ({ org }) => post<PaginationResponse<OrganizationPermissionDetails>>(`/organization`, org),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', 'mine'] });
	},
});

const updateOrganization = (
	org_id: string
): UseMutationOptions<PrivateOrganization, Error, { org: CreateOrganizationType }, PrivateOrganization> => ({
	mutationKey: ['organization', 'update'],
	mutationFn: ({ org }) => patch<PrivateOrganization>(`/organization/${org_id}`, org),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', 'mine'] });
	},
});

const AcceptInvitation = (
	org_id: string
): UseMutationOptions<{ success: boolean; message?: string }, Error, { accept: boolean }> => ({
	mutationFn: ({ accept }: { accept: boolean }) =>
		put<{ success: boolean; message?: string }>(`/organization/${org_id}/members/invite`, { accept }),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', 'mine'] });
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', 'invitation', 'pending'] });
	},
});

const approveOrganization = (
	org_id: string
): UseMutationOptions<{ success: boolean; message?: string }, Error, { accept: boolean }> => ({
	mutationFn: ({ accept }: { accept: boolean }) =>
		put<{ success: boolean; message?: string }>(`/organization/${org_id}/approve`, { approve: accept }),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', 'mine'] });
		GlobalQueryClient.invalidateQueries({queryKey: ['organization', 'approve']});
	},
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
	createOrganization,
	getOrganizationMembers,
	getOrganizationMemberById,
	updateOrganizationUserPermission,
	deleteOrganizationMember,
	inviteOrganizationMembers,
	createOrganizationPermission,
	updateOrganizationPermission,
	getOrganizationFollowers,
	getOrganizations,
	getOrganizationInvites,
	AcceptInvitation,
	getOrganizationPermissions,
	getOrganizationFollowerNumber,
	updateOrganization,
	getPendingApproveOrganization,
	approveOrganization,
};
