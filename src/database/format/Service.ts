import { PrivateService, PublicService } from "@/types/Service";
import { Prisma } from "../prisma/generated/client";
import { formatPrivateOrganization, formatPublicOrganization } from "./Organization";
import { formatServiceCategory } from "./ServiceCategories";

export function formatPublicService(row: Prisma.servicesGetPayload<{ include: { organization: true, category: true } }>): PublicService {
	return {
		...row,
		organization: formatPublicOrganization(row.organization),
		category: formatServiceCategory(row.category),
	};
}

export function formatPrivateService(row: Prisma.servicesGetPayload<{ include: { organization: true, category: true } }>): PrivateService {
	return {
		...row,
		organization: formatPrivateOrganization(row.organization),
		category: formatServiceCategory(row.category),
	};
}