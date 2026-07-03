import { InfiniteData, QueryKey, UseInfiniteQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { GlobalQueryClient } from './queryClient';
import { CreateOrUpdateEventType, PrivateEvent } from '@/types/Event';
import { get, post } from '../fetcher';
import { PaginationResponse } from '@/types/PaginationResponse';

const getEvents = (
	org_id: string
): UseInfiniteQueryOptions<
	PaginationResponse<PrivateEvent<object>>,
	Error,
	InfiniteData<PaginationResponse<PrivateEvent<object>>>,
	QueryKey,
	number
> => ({
	queryFn: ({ pageParam }) =>
		get<PaginationResponse<PrivateEvent<object>>>(`/organization/${org_id}/events?page=${pageParam}`),
	queryKey: ['organization', org_id, 'event'],
	initialPageParam: 1,
	getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
});

const createEvent = (
	org_id: string
): UseMutationOptions<PrivateEvent<object>, Error, { event: CreateOrUpdateEventType }> => ({
	mutationFn: ({ event }) => post<PrivateEvent<object>>(`/organization/${org_id}/events`, event),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'event'] });
	},
});

export { createEvent, getEvents };
