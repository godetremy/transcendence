'use client';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { CreateOrUpdateEventType } from '@/types/Event';
import { useParams, useRouter } from 'next/navigation';
import { getEvent, updateEventMutate } from '@/lib/fetcher/events';
import { OrganizationEventEditor } from '@/components/organization/OrganizationEventEditor/OrganizationEventEditor';

export default function Page() {
	const router = useRouter();
	const params = useParams();
	const event_id = params.event_id as string;
	const orgctx = useOrganizations();
	const organization = orgctx.getCurrentOrganization()!;

	const { mutate } = useMutation(updateEventMutate(organization.id));

	const { data, isLoading } = useQuery(getEvent(organization.id, event_id));
	const [event, setEvent] = useState<CreateOrUpdateEventType>({
		title: '',
		subtitle: '',
		description: '',
		max_registration: null,
		location: '',
		image: '',
		start_at: new Date(),
		end_at: new Date(),
	});

	useEffect(() => {
		if (data) {
			setEvent({
				title: data.title,
				subtitle: data.subtitle,
				description: data.description,
				max_registration: data.max_registration,
				location: data.location,
				image: data.image,
				start_at: new Date(data.start_at),
				end_at: new Date(data.end_at),
			});
		}
	}, [data]);

	const handleSubmit = () => {
		if (event) {
			mutate({ event, event_id });
		}
	};

	return (
		<>
			<OrganizationEventEditor
				event={event}
				setEvent={setEvent}
				onSubmit={handleSubmit}
				onNew={() => router.push('../../events')}
			></OrganizationEventEditor>
		</>
	);
}
