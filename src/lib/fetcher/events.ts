import { UseMutationOptions } from '@tanstack/react-query';
import { GlobalQueryClient } from './queryClient';
import { CreateOrUpdateEventType, PrivateEvent } from '@/types/Event';
import { post } from '../fetcher';

const createEvent = (
	org_id: string
): UseMutationOptions<PrivateEvent<object>, Error, { event: CreateOrUpdateEventType }> => ({
	mutationFn: ({ event }) => post<PrivateEvent<object>>(`/organization/${org_id}/events`, event),
	onSuccess: () => {
		GlobalQueryClient.invalidateQueries({ queryKey: ['organization', org_id, 'event'] });
	},
});

export { createEvent };
