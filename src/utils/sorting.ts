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

const matchBetweenTables = (sorting: SortingOption[], matchList: string[]): { [x: string]: string }[] => {
	const match = matchList.map((row) => ({
		id: row.split('|')[0],
		match: row.split('|')[1],
	}));
	let tab: { [x: string]: string }[] = [];
	for (const rowSorting of sorting) {
		const valueFind = match.find((e) => e.id == rowSorting.id);
		if (valueFind == null) throw ERRORS_DETAILS.invalid_parameter(rowSorting.id);
		tab.push({ [valueFind.match]: rowSorting.sort });
	}
	return tab;
};

const sortingToPrisma = (sorting: SortingOption[], matchList: string[]): { orderBy?: object[] } => {
	if (matchList.length <= 0 || sorting.length <= 0) return {};
	const value = matchBetweenTables(sorting, matchList);
	if (value.length <= 0) return {};
	return { orderBy: value };
};

export { DEFAULT_SORTINGOPTIONS, getSortingParams, sortingToPrisma };
