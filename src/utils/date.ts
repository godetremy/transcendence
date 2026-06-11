import { DateOption } from "@/types/DateParameters";
import { DateEventParamSchema } from "@/schema/EventForm";
import { parseParams } from "./parsing";

const DEFAULT_DATEOPTION: DateOption = { from: new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString(), to: new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString() };

const getDateParams = (params: URLSearchParams): DateOption => {
	const data = parseParams<DateOption>(params, DateEventParamSchema);
	console.error('data :', data);
	return data;
};

const dateToPrisma = (time: DateOption): { start_at: {gte: Date}, end_at: {lte: Date}} => {
	return {
		start_at: {
			gte: new Date(time.from),
		},
		end_at: {
			lte: new Date(time.to),
		},
	}
}

export {
	getDateParams,
	dateToPrisma,
	DEFAULT_DATEOPTION,
}