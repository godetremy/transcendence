'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { CreateOrUpdateEventType } from '@/types/Event';
import { createEventMutate } from '@/lib/fetcher/events';
import { OrganizationEventEditor } from '@/components/organization/OrganizationEventEditor/OrganizationEventEditor';
import { useRouter } from 'next/navigation';

export default function Page() {
	const router = useRouter();
	const orgctx = useOrganizations();
	const organization = orgctx.getCurrentOrganization()!;

	const { mutate } = useMutation(createEventMutate(organization.id));

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

	const handleSubmit = () => {
		if (event) {
			mutate({ event });
		}
	};

	return (
		<>
			<OrganizationEventEditor
				event={event}
				setEvent={setEvent}
				onSubmit={handleSubmit}
				onNew={() => router.push('../events')}
				createEvent={true}
			></OrganizationEventEditor>
		</>
	);
}
