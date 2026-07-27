import {
	InfiniteData,
	QueryKey,
	UseInfiniteQueryOptions,
	UseMutationOptions,
	UseQueryOptions,
} from '@tanstack/react-query';
import { GlobalQueryClient } from './queryClient';
import { CreateOrUpdateEventType, PrivateEvent, PublicEvent, PublicRegisterUser } from '@/types/Event';
import { deletef, get, patch, post, put } from '../fetcher';
import { PaginationResponse } from '@/types/PaginationResponse';

const getEvents = (
	org_id: string,
	generatedParameters: string | null,
	from: string | null,
	to: string | null,
	q: string | null,
	activeMenu: number | null,
	generatedParametersFilter: string | null
): UseInfiniteQueryOptions<
	PaginationResponse<PrivateEvent<{ event_registration: true; users: true }>>,
	Error,
	InfiniteData<PaginationResponse<PrivateEvent<{ event_registration: true; users: true }>>>,
	QueryKey,
	number
> => ({
	queryFn: ({ pageParam }) =>
		get<PaginationResponse<PrivateEvent<{ event_registration: true; users: true }>>>(
			`/organization/${org_id}/events?page=${pageParam}${from == null ? '' : '&from=' + from}${to == null ? '' : '&to=' + to}${q == null || q.length == 0 ? '' : '&q=' + encodeURI(q.trim())}${generatedParameters == null ? '' : '&sort=' + encodeURI(generatedParameters.trim())}${generatedParametersFilter == null ? '' : '&filter=' + encodeURI(generatedParametersFilter.trim())}`
		),
	queryKey: ['organization', org_id, 'event', activeMenu, q, generatedParameters, generatedParametersFilter],
	initialPageParam: 1,
	getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
});

const getEventsPublic = (
	from: string | null,
	to: string | null,
	q: string | null,
	activeMenu: number | null
): UseInfiniteQueryOptions<
	PaginationResponse<PublicEvent<object>>,
	Error,
	InfiniteData<PaginationResponse<PublicEvent<object>>>,
	QueryKey,
	number
> => ({
	queryFn: ({ pageParam }) =>
		get<PaginationResponse<PublicEvent<object>>>(
			`/events?page=${pageParam}${from == null ? '' : '&from=' + from}${to == null ? '' : '&to=' + to}${q == null || q.length == 0 ? '' : '&q=' + encodeURI(q.trim())}`
		),
	queryKey: ['event', 'public', activeMenu, q],
	initialPageParam: 1,
	getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
});

const getEvent = (org_id: string, event_id: string): UseQueryOptions<PrivateEvent, Error> => ({
	queryFn: () => get<PrivateEvent>(`/organization/${org_id}/events/${event_id}`),
	queryKey: ['organization', org_id, 'event', event_id],
});

const getEventPublic = (event_id: string): UseQueryOptions<PublicRegisterUser<{ organization: true }>, Error> => ({
	queryFn: () => get<PublicRegisterUser<{ organization: true }>>(`/events/${event_id}`),
	queryKey: ['event', 'public', event_id],
});

const createEventMutate = (
	org_id: string
): UseMutationOptions<PrivateEvent<object>, Error, { event: CreateOrUpdateEventType }> => ({
	mutationFn: ({ event }) => post<PrivateEvent<object>>(`/organization/${org_id}/events`, event),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'event'] });
	},
});

const registerEventMutate = (
	event_id: string
): UseMutationOptions<{ success: true }, Error, { register: string | null }> => ({
	mutationFn: ({ register }) => put<{ success: true }>(`/events/${event_id}`, { register }),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['event', 'public', event_id] });
	},
});

const deleteEventMutate = (
	org_id: string
): UseMutationOptions<PrivateEvent<object>, Error, { event: PrivateEvent<object> }> => ({
	mutationFn: ({ event }) => deletef<PrivateEvent<object>>(`/organization/${org_id}/events/${event.id}`, {}),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'event'] });
	},
});

const exportEventMutate = (
	org_id: string
): UseMutationOptions<Response, Error, { type: string; filename: string }> => ({
	mutationFn: ({ type, filename }) =>
		post<Response>(`/organization/${org_id}/events/export`, { type, filename }, false),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'event'] });
	},
});

const importEventMutate = (org_id: string): UseMutationOptions<Response, Error, { body: FormData }> => ({
	mutationFn: ({ body }) => post<Response>(`/organization/${org_id}/events/import`, body, false),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'event'] });
	},
});

const updateEventMutate = (
	org_id: string
): UseMutationOptions<PrivateEvent<object>, Error, { event: CreateOrUpdateEventType; event_id: string }> => ({
	mutationFn: ({ event, event_id }) =>
		patch<PrivateEvent<object>>(`/organization/${org_id}/events/${event_id}`, event),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'event'] });
	},
});

export {
	createEventMutate,
	getEvents,
	deleteEventMutate,
	exportEventMutate,
	importEventMutate,
	updateEventMutate,
	getEvent,
	getEventsPublic,
	getEventPublic,
	registerEventMutate,
};
