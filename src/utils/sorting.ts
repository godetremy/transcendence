import { SortingOption } from '@/types/SortingParameters';
import { ERRORS_DETAILS } from './errors';

const DEFAULT_SORTINGOPTIONS: SortingOption[] = [];
const DEFAULT_SORTINGOPTION: SortingOption = { id: '', sort: 'desc' };

const getSortingParams = (params: URLSearchParams): SortingOption[] => {
	const sorting: SortingOption[] = [];

	if (params.has('sort')) {
		const sort = params.get('sort')!;

		const fields = sort.split(',').map((s) => s.trim());
		for (const field of fields) {
			const detail = field.split(' ');

			const option: SortingOption = DEFAULT_SORTINGOPTION;

			if (detail.length >= 1) option.id = detail[0];
			if (detail.length >= 2) option.sort = detail[1];
			sorting.push({ ...option });
		}
	}
	return sorting;
};

const matchBetweenTables = (sorting: SortingOption[], matchList: string[]): void => {
	for (const rowSorting of sorting) {
		const valueFind = matchList.find((e) => e == rowSorting.id);
		if (valueFind == null) throw ERRORS_DETAILS.invalid_parameter(rowSorting.id);
	}
};

const sortingToPrisma = (sorting: SortingOption[], matchList: string[]): object | null => {
	if (matchList.length <= 0) return {};
	matchBetweenTables(sorting, matchList);
	const value: { [x: string]: string }[] = [];
	for (const s of sorting) {
		value.push({ [s.id]: s.sort });
	}
	if (value.length <= 0) return null;
	return {
		orderBy: value,
	};
};

export { DEFAULT_SORTINGOPTIONS, getSortingParams, sortingToPrisma };
