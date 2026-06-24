import { PrivateService, PublicService } from '@/types/Service';
import { Prisma } from '../prisma/generated/client';
import { formatPrivateOrganization, formatPublicOrganization } from './Organization';
import { formatServiceCategory } from './ServiceCategories';

const formatPublicService = <T extends Prisma.servicesInclude>(
	row: Prisma.servicesGetPayload<{ include: T }>
): PublicService => {
	const { created_at, updated_at, start_at, end_at, ...service } = row;
	return {
		...service,
		created_at: created_at.toISOString(),
		updated_at: updated_at.toISOString(),
		start_at: !start_at ? null : start_at.toISOString(),
		end_at: !end_at ? null : end_at.toISOString(),
		category:
			'category' in row && row.category
				? formatServiceCategory(row.category as Prisma.service_categoriesGetPayload<object>)
				: undefined,
		organization:
			'organization' in row && row.organization
				? formatPublicOrganization<object>(row.organization as Prisma.organizationsGetPayload<object>)
				: undefined,
	};
};

const formatPrivateService = <T extends Prisma.servicesInclude>(
	row: Prisma.servicesGetPayload<{ include: T }>
): PrivateService => {
	const { created_at, updated_at, start_at, end_at, ...service } = row;
	return {
		...service,
		created_at: created_at.toISOString(),
		updated_at: updated_at.toISOString(),
		start_at: !start_at ? null : start_at.toISOString(),
		end_at: !end_at ? null : end_at.toISOString(),
		category:
			'category' in row && row.category
				? formatServiceCategory(row.category as Prisma.service_categoriesGetPayload<object>)
				: undefined,
		organization:
			'organization' in row && row.organization
				? formatPrivateOrganization<object>(row.organization as Prisma.organizationsGetPayload<object>)
				: undefined,
	};
};

export { formatPublicService, formatPrivateService };
