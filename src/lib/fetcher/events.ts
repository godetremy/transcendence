import {
	InfiniteData,
	QueryKey,
	UseInfiniteQueryOptions,
	UseMutationOptions,
	UseQueryOptions,
} from '@tanstack/react-query';
import { GlobalQueryClient } from './queryClient';
import { CreateOrUpdateEventType, PrivateEvent, PublicEvent } from '@/types/Event';
import { deletef, get, patch, post, put } from '../fetcher';
import { PaginationResponse } from '@/types/PaginationResponse';
import { DateParse } from '@/app/app/api/events/route';

const getEvents = (
	org_id: string,
	generatedParameters: string | null,
	from: string | null,
	to: string | null,
	q: string | null,
	activeMenu: number | null
): UseInfiniteQueryOptions<
	PaginationResponse<PrivateEvent<{ event_registration: true; users: true }>>,
	Error,
	InfiniteData<PaginationResponse<PrivateEvent<{ event_registration: true; users: true }>>>,
	QueryKey,
	number
> => ({
	queryFn: ({ pageParam }) =>
		get<PaginationResponse<PrivateEvent<{ event_registration: true; users: true }>>>(
			`/organization/${org_id}/events?page=${pageParam}${from == null ? '' : '&from=' + from}${to == null ? '' : '&to=' + to}${q == null || q.length == 0 ? '' : '&q=' + encodeURI(q.trim())}${generatedParameters == null ? '' : '&sort=' + encodeURI(generatedParameters.trim())}`
		),
	queryKey: ['organization', org_id, 'event', activeMenu, q, generatedParameters],
	initialPageParam: 1,
	getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
});

const getEventsPublic = (
	from: string | null,
	to: string | null,
	q: string | null,
	activeMenu: number | null
): UseInfiniteQueryOptions<
	PaginationResponse<DateParse<{ event_registration: true; users: true }>>,
	Error,
	InfiniteData<PaginationResponse<DateParse<{ event_registration: true; users: true }>>>,
	QueryKey,
	number
> => ({
	queryFn: ({ pageParam }) =>
		get<PaginationResponse<DateParse<{ event_registration: true; users: true }>>>(
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

const getEventPublic = (event_id: string): UseQueryOptions<PublicEvent<{ organization: true }>, Error> => ({
	queryFn: () => get<PublicEvent<{ organization: true }>>(`/events/${event_id}`),
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

const getregisterUserToEvent = (event_id: string): UseQueryOptions<{ success: boolean; register: boolean }, Error> => ({
	queryFn: () => get<{ success: boolean; register: boolean }>(`/events/${event_id}/register`),
	queryKey: ['event', 'public', event_id, 'register'],
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
	mutationFn: ({ body }) => post<Response>(`/organization/${org_id}/events/import`, body, false, false),
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
	getregisterUserToEvent,
};
