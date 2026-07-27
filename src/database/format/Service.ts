import { ExportServiceType, ImportServiceType, PrivateService, PublicService } from '@/types/Service';
import { Prisma } from '../prisma/generated/client';
import { formatPrivateOrganization, formatPublicOrganization } from './Organization';
import { formatServiceCategory } from './ServiceCategories';

const formatPublicService = <T extends Prisma.servicesInclude>(
	row: Prisma.servicesGetPayload<{ include: T }>
): PublicService<T> => {
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
	} as unknown as PublicService<T>;
};

const formatPrivateService = <T extends Prisma.servicesInclude>(
	row: Prisma.servicesGetPayload<{ include: T }>
): PrivateService<T> => {
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
	} as unknown as PrivateService<T>;
};

const formatExportService = (row: Prisma.servicesGetPayload<object>): ExportServiceType => {
	return {
		title: row.title,
		subtitle: row.subtitle ?? '',
		description: row.description ?? '',
		registration_required: row.registration_required,
		registration_details: row.registration_details,
		registration_link: row.registration_link,
		edition: row.edition,
		location: row.location ?? '',
		end_at: row.end_at == null ? '' : row.end_at.toISOString(),
		start_at: row.start_at == null ? '' : row.start_at.toISOString(),
	};
};

const formatDataService = (data: ImportServiceType[], org_id: string): Prisma.servicesCreateManyInput[] => {
	return data.map((row) => ({
		title: row.title,
		subtitle: row.subtitle,
		description: row.description,
		registration_required: row.registration_required,
		registration_details: row.registration_details,
		registration_link: row.registration_link,
		edition: row.edition,
		location: row.location,
		...(row.start_at != null ? { start_at: new Date(row.start_at) } : {}),
		...(row.end_at != null ? { end_at: new Date(row.end_at) } : {}),
		organization_id: org_id,
		image: '',
		category_id: '',
	}));
};

export { formatPublicService, formatPrivateService, formatExportService, formatDataService };
