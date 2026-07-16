import { DateOption } from '@/types/DateParameters';
import { DateEventParamSchema } from '@/schema/EventSchema';
import { parseParams } from './parsing';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DEFAULT_DATEOPTION: DateOption = {
	from: new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString(),
	to: new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString(),
};

const getDateParams = (params: URLSearchParams): DateOption => {
	return parseParams<DateOption>(params, DateEventParamSchema);
};

const dateToPrisma = (time: DateOption): { start_at?: { gte: Date }; end_at?: { lte: Date } } => {
	return {
		...(time.from == null
			? {}
			: {
					start_at: {
						gte: new Date(time.from),
					},
				}),
		...(time.to == null
			? {}
			: {
					end_at: {
						lte: new Date(time.to),
					},
				}),
	};
};

const toHumanReadablePeriod = (from: Date, to: Date): string => {
	const from_day = format(from, 'EEEE', { locale: fr });
	const from_hour = format(from, 'HH', { locale: fr });
	const from_minute = format(from, 'mm', { locale: fr });
	const to_day = format(to, 'EEEE', { locale: fr });
	const to_hour = format(to, 'HH', { locale: fr });
	const to_minute = format(to, 'mm', { locale: fr });

	if (from.getDate() === to.getDate() && from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear())
		return `${from_day.charAt(0).toUpperCase()}${from_day.slice(1)} de ${from_hour}h${from_minute} à ${to_hour}h${to_minute}`;
	return `Du ${from_day} de ${from_hour}h${from_minute} au ${to_day} à ${to_hour}h${to_minute}`;
};

export { getDateParams, dateToPrisma, DEFAULT_DATEOPTION, toHumanReadablePeriod };
