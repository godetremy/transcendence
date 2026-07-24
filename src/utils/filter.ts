import { FilterComparaison, ParsedFilterOption } from '@/types/Filter';
import { ERRORS_DETAILS } from './errors';

const DEFAULT_FILTEROPTIONS: ParsedFilterOption[] = [];

const VALID_COMPARAISONS = new Set<string>(Object.values(FilterComparaison));

const getFilterParams = (params: URLSearchParams): ParsedFilterOption[] => {
	const filterValue: ParsedFilterOption[] = [];

	if (params.has('filter')) {
		const filter = params.get('filter')!;

		const fields = filter
			.split(',')
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
		for (const field of fields) {
			const detail = field.split(' ');
			if (detail[0].length === 0) continue;

			const id = detail[0];
			const comparaison = detail.length >= 2 ? detail[1] : '';
			const value = detail.slice(2).join(' ');

			if (!VALID_COMPARAISONS.has(comparaison)) {
				throw ERRORS_DETAILS.invalid_parameter(comparaison);
			}

			filterValue.push({
				id,
				value,
				comparaison: comparaison as FilterComparaison,
			});
		}
	}
	return filterValue;
};

export { DEFAULT_FILTEROPTIONS, getFilterParams };
