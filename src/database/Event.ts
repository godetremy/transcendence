import { PaginationParameters } from '@/types/PaginationParameters';
import { prisma } from './prisma/prisma';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';
import { DEFAULT_SORTINGOPTIONS, sortingToPrisma } from '@/utils/sorting';
import { SortingOption } from '@/types/SortingParameters';
import { DateOption } from '@/types/DateParameters';
import { DEFAULT_DATEOPTION, dateToPrisma } from '@/utils/date';
import { AuthorEvent } from '@/types/Event';

const getEventsByFilter = async (
	data: AuthorEvent,
	time?: DateOption,
	sorting?: SortingOption[],
	pagination?: PaginationParameters
) => {
	const value = await prisma.event.findMany({
		include: {
			author: true,
			registered: true,
			image_album: true,
		},
		where: {
			registered: {
				...(data.subscribe ? { user_id: data.user_id } : {}),
			},
			author: {
				...(data.club ? { full_name: data.club } : {}),
			},
			...dateToPrisma(time ?? DEFAULT_DATEOPTION),
		},
		...sortingToPrisma(sorting ?? DEFAULT_SORTINGOPTIONS, ['title', 'description']),
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
	return value;
};

export { getEventsByFilter };
