export enum FilterComparaison {
	INFERIOR = '.inf.',
	INFERIOR_OR_EQUAL = '.infeq.',
	EQUAL = '.eq.',
	SUPERIOR_OR_EQUAL = '.supeq.',
	SUPERIOR = '.sup.',
	INCLUDE = '.in.',
	EXCLUDE = '.exclude.',
}

export const FilterComparaisonOptions: Record<FilterComparaison, string> = {
	[FilterComparaison.INFERIOR]: '<',
	[FilterComparaison.INFERIOR_OR_EQUAL]: '<=',
	[FilterComparaison.EQUAL]: '=',
	[FilterComparaison.SUPERIOR_OR_EQUAL]: '>=',
	[FilterComparaison.SUPERIOR]: '>',
	[FilterComparaison.INCLUDE]: 'contient',
	[FilterComparaison.EXCLUDE]: 'ne contient pas',
};

export enum FilterType {
	STRING = 'string',
	NUMBER = 'number',
	DATE = 'date',
	BOOLEAN = 'boolean',
}

export interface Filter {
	id: string;
	title: string;
	type: FilterType;
}

export interface FilterOption {
	id: string;
	title: string;
	comparaison: FilterComparaison;
	value: string;
}

export interface ParsedFilterOption {
	id: string;
	value: string;
	comparaison: FilterComparaison;
}
