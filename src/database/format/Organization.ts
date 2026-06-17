import { Prisma } from '../prisma/generated/client';
import { PrivateOrganization, PublicOrganization } from '@/types/Organization';

const formatPrivateOrganization = (row: Prisma.organizationsGetPayload<object>): PrivateOrganization => {
	return {
		id: row.id,
		owner: row.owner_id,
		name: row.name,
		description: row.description,
		logo: row.logo,
		club: row.club,
		created_at: row.created_at,
		updated_at: row.updated_at,
	};
};

const formatPublicOrganization = (row: Prisma.organizationsGetPayload<object>): PublicOrganization => {
	return {
		id: row.id,
		name: row.name,
		description: row.description,
		logo: row.logo,
		club: row.club,
		created_at: row.created_at,
		updated_at: row.updated_at,
	};
};

export { formatPrivateOrganization, formatPublicOrganization };
