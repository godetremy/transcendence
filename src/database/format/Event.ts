import { Prisma } from '@/database/prisma/generated/client';
import { PrivateEvent, PublicEvent } from '@/types/Event';
import { formatPrivateOrganization, formatPublicOrganization } from './Organization';
import { formatPrivateAlbum } from './Album';
import { formatPrivateRegisteredEvent } from './EventRegistrations';

const formatPublicEvent = <T extends Prisma.eventsInclude>(
	row: Prisma.eventsGetPayload<{ include: T }>
): PublicEvent<T> => {
	// This filter private database data.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { organization_id, photos_album_id, start_at, end_at, created_at, update_at, ...event } = row;
	return {
		...event,
		start_at: start_at.toISOString(),
		end_at: end_at.toISOString(),
		created_at: created_at.toISOString(),
		update_at: update_at.toISOString(),
		organization:
			'organization' in row && row.organization
				? formatPublicOrganization<object>(row.organization as Prisma.organizationsGetPayload<object>)
				: undefined,
	} as unknown as PublicEvent<T>;
};

const formatPrivateEvent = <T extends Prisma.eventsInclude>(
	row: Prisma.eventsGetPayload<{ include: T }>
): PrivateEvent<T> => {
	// This filter private database data.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { organization_id, photos_album_id, start_at, end_at, created_at, update_at, ...event } = row;
	return {
		...event,
		start_at: start_at.toISOString(),
		end_at: end_at.toISOString(),
		created_at: created_at.toISOString(),
		update_at: update_at.toISOString(),
		register_number:
			'event_registration' in row && row.event_registration
				? (row.event_registration as Prisma.event_registrationsGetPayload<object>[]).length
				: undefined,
		organization:
			'organization' in row && row.organization
				? formatPrivateOrganization<object>(row.organization as Prisma.organizationsGetPayload<object>)
				: undefined,
		photos_album:
			'photos_album' in row && row.photos_album
				? formatPrivateAlbum(row.photos_album as Prisma.photos_albumGetPayload<object>)
				: undefined,
		event_registration:
			'event_registration' in row && row.event_registration
				? (row.event_registration as Prisma.event_registrationsGetPayload<object>[]).map(
						formatPrivateRegisteredEvent
					)
				: undefined,
	} as unknown as PrivateEvent<T>;
};

export { formatPrivateEvent, formatPublicEvent };
