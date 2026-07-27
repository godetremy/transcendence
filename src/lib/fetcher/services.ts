import { InfiniteData, QueryKey, UseInfiniteQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { GlobalQueryClient } from './queryClient';
import { deletef, get, patch, post } from '../fetcher';
import { PaginationResponse } from '@/types/PaginationResponse';
import { CreateOrUpdateServiceType, PrivateService } from '@/types/Service';

const getServices = (
	org_id: string,
	generatedParameters: string | null,
	from: string | null,
	to: string | null,
	q: string | null,
	activeMenu: number | null
): UseInfiniteQueryOptions<
	PaginationResponse<PrivateService<object>>,
	Error,
	InfiniteData<PaginationResponse<PrivateService<object>>>,
	QueryKey,
	number
> => ({
	queryFn: ({ pageParam }) =>
		get<PaginationResponse<PrivateService<object>>>(
			`/organization/${org_id}/services?page=${pageParam}${from == null ? '' : '&from=' + from}${to == null ? '' : '&to=' + to}${q == null || q.length == 0 ? '' : '&q=' + encodeURI(q.trim())}${generatedParameters == null ? '' : '&sort=' + encodeURI(generatedParameters.trim())}`
		),
	queryKey: ['organization', org_id, 'service', activeMenu, q, generatedParameters],
	initialPageParam: 1,
	getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
});

const createServiceMutate = (
	org_id: string
): UseMutationOptions<PrivateService<object>, Error, { service: CreateOrUpdateServiceType }> => ({
	mutationFn: ({ service }) => post<PrivateService<object>>(`/organization/${org_id}/services`, service),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'service'] });
	},
});

const deleteServiceMutate = (
	org_id: string
): UseMutationOptions<PrivateService<object>, Error, { service: PrivateService<object> }> => ({
	mutationFn: ({ service }) => deletef<PrivateService<object>>(`/organization/${org_id}/services/${service.id}`, {}),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'service'] });
	},
});

const exportServiceMutate = (
	org_id: string
): UseMutationOptions<Response, Error, { type: string; filename: string }> => ({
	mutationFn: ({ type, filename }) =>
		post<Response>(`/organization/${org_id}/services/export`, { type, filename }, false),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'service'] });
	},
});

const importServiceMutate = (org_id: string): UseMutationOptions<Response, Error, { body: FormData }> => ({
	mutationFn: ({ body }) => post<Response>(`/organization/${org_id}/services/import`, body, false, undefined, false),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'service'] });
	},
});

const updateServiceMutate = (
	org_id: string
): UseMutationOptions<PrivateService<object>, Error, { service: CreateOrUpdateServiceType; service_id: string }> => ({
	mutationFn: ({ service, service_id }) =>
		patch<PrivateService<object>>(`/organization/${org_id}/services/${service_id}`, service),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'service'] });
	},
});

export {
	createServiceMutate,
	getServices,
	deleteServiceMutate,
	exportServiceMutate,
	importServiceMutate,
	updateServiceMutate,
};
