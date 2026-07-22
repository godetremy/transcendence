import styles from './component.module.scss';
import { ButtonHTMLAttributes, DetailedHTMLProps, useState } from 'react';
import { AnimatePresence, motion, TargetAndTransition } from 'motion/react';
import { Plus } from 'lucide-react';
import { MenuButton } from '@/components/globals/MenuButton/MenuButton';

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

export interface FilterButtonProps extends DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> {
	options: Array<Filter>;
	onChangeFilter?: (filter: FilterOption[]) => void;
}

export type FilterOption = {
	id: string;
	title: string;
	comparaison: FilterComparaison;
	value: string;
};

export function FilterButton({ options, onChangeFilter, ...props }: FilterButtonProps) {
	const [visibleMenu, setVisibleMenu] = useState(false);
	const [filters, setFilters] = useState<FilterOption[]>([]);

	const closedContainer: TargetAndTransition = {
		opacity: 0,
		scaleY: 0.9,
		scaleX: 0.7,
		translateY: '-10%',
		transition: { type: 'spring', stiffness: 600, damping: 30 },
	};
	const openedContainer: TargetAndTransition = {
		opacity: 1,
		scaleY: 1,
		scaleX: 1,
		translateY: '0%',
		transition: { type: 'spring', stiffness: 600, damping: 30 },
	};

	const applyFilter = () => {
		setVisibleMenu(false);
		onChangeFilter?.(filters);
	};

	return (
		<>
			<button {...props} onClick={() => setVisibleMenu(!visibleMenu)} style={{ anchorName: '--menu_button' }} />
			<AnimatePresence>
				{visibleMenu && (
					<>
						<motion.div
							className={styles.menu_overlay}
							onClick={applyFilter}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0, pointerEvents: 'none' }}
						/>

						<motion.div
							className={styles.menu_container}
							key="container"
							initial={closedContainer}
							animate={openedContainer}
							exit={closedContainer}
						>
							<div className={styles.filtering_container}>
								{filters.length === 0 && (
									<div className={styles.empty_filters}>
										<h3>Aucun filtre</h3>
										<p>Appuie sur ajouter pour ajouter un filtre.</p>
									</div>
								)}
								{filters.map((item, index) => (
									<div key={index} className={styles.filters}>
										<select
											value={item.id}
											onChange={(e) =>
												setFilters((prev) => {
													const option = options.find((o) => o.id === e.target.value);
													if (!option) return prev;

													return prev.map((filter, i) =>
														i === index ? { ...filter, id: option.id } : filter
													);
												})
											}
										>
											{options.map((option) => (
												<option key={option.id} value={option.id}>
													{option.title}
												</option>
											))}
										</select>
										<select
											value={item.comparaison}
											onChange={(e) =>
												setFilters((prev) => {
													return prev.map((filter, i) =>
														i === index
															? {
																	...filter,
																	comparaison: e.target.value as FilterComparaison,
																}
															: filter
													);
												})
											}
											className={styles.comparaison_select}
										>
											{Object.values(FilterComparaison).map((comparaison) => (
												<option key={comparaison} value={comparaison}>
													{FilterComparaisonOptions[comparaison]}
												</option>
											))}
										</select>
										<input
											type={'text'}
											value={item.value}
											onChange={(e) =>
												setFilters((prev) => {
													return prev.map((filter, i) =>
														i === index
															? {
																	...filter,
																	value: e.currentTarget.value,
																}
															: filter
													);
												})
											}
										/>
										<MenuButton
											containerKey={`${item.id}_menu_${index}`}
											menu={[
												{
													title: 'Retirer',
													negative: true,
													onClick: () =>
														setFilters((prev) => prev.filter((_, i) => i !== index)),
												},
											]}
										/>
									</div>
								))}
							</div>
							<div className={styles.sorting_footer}>
								<button
									onClick={() =>
										setFilters((prev) => [
											...prev,
											{
												id: options[0].id,
												title: options[0].title,
												comparaison: FilterComparaison.EQUAL,
												value: '',
											},
										])
									}
								>
									<Plus />
									Ajouter
								</button>

								<button onClick={applyFilter} className={styles.apply_button}>
									Appliquer
								</button>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
