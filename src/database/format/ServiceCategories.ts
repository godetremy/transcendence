import { Prisma } from '@/database/prisma/generated/client';
import { ServiceCategory } from '@/types/ServiceCategory';

const formatServiceCategory = (
	category: Prisma.service_categoriesGetPayload<Prisma.service_categoriesDefaultArgs>
): ServiceCategory => {
	return {
		...category,
		description: category.description ?? undefined,
		icon: category.icon ?? '/images/default_service_icon.png',
		background_image: category.background_image ?? '/images/default_service_background.png',
		created_at: category.created_at.toISOString(),
		updated_at: category.updated_at.toISOString(),
	};
};

export { formatServiceCategory };
