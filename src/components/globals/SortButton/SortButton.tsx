import styles from './component.module.scss';
import { ButtonHTMLAttributes, DetailedHTMLProps, useState } from 'react';
import { AnimatePresence, motion, TargetAndTransition } from 'motion/react';
import { ArrowDown, ArrowUp, MinusCircle, Plus } from 'lucide-react';

export interface SortingButtonProps extends DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> {
	sortingOptions: Array<{
		id: string;
		title: string;
	}>;
	onChangeSort?: (filter: SortingOption[]) => void;
}

export type SortingOption = {
	id: string;
	title: string;
	ascendant: boolean;
};

export function SortButton({ sortingOptions, onChangeSort, ...props }: SortingButtonProps) {
	const [visibleMenu, setVisibleMenu] = useState(false);
	const [sorting, setSorting] = useState<SortingOption[]>([]);

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

	const applySorting = () => {
		setVisibleMenu(false);
		onChangeSort?.(sorting);
	};

	return (
		<>
			<button {...props} onClick={() => setVisibleMenu(!visibleMenu)} style={{ anchorName: '--menu_button' }} />
			<AnimatePresence>
				{visibleMenu && (
					<>
						<motion.div
							className={styles.menu_overlay}
							onClick={applySorting}
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
							<div className={styles.sorting_container}>
								{sorting.length === 0 && (
									<div className={styles.empty_sorting_options}>
										<h3>Ajoute une option de tri</h3>
										<p>Appuie sur un éléments ci-dessous pour ajouter une méthode de tri</p>
										<ArrowDown />
									</div>
								)}
								{sorting.map((item, index) => (
									<div key={item.id} className={styles.sorting_option}>
										<button
											onClick={() => setSorting((prev) => prev.filter((s) => s.id !== item.id))}
										>
											<MinusCircle size={20} />
										</button>
										<p>
											{index === 0 ? 'Trier par ' : 'Puis par '}
											<span>{item.title.toLowerCase()}</span>
										</p>

										<div className={styles.direction_options}>
											<button
												className={item.ascendant ? styles.active : undefined}
												onClick={() =>
													setSorting((prev) =>
														prev.map((s) =>
															s.id === item.id ? { ...s, ascendant: true } : s
														)
													)
												}
											>
												<ArrowUp size={20} />
											</button>
											<button
												className={item.ascendant ? undefined : styles.active}
												onClick={() =>
													setSorting((prev) =>
														prev.map((s) =>
															s.id === item.id ? { ...s, ascendant: false } : s
														)
													)
												}
											>
												<ArrowDown size={20} />
											</button>
										</div>
									</div>
								))}
							</div>
							<div className={styles.sorting_footer}>
								<div className={styles.sorting_options_container}>
									{sortingOptions
										.filter((o) => !sorting.find((s) => s.id === o.id))
										.map((item, index) => (
											<button
												key={index}
												onClick={() =>
													setSorting((prev) => [
														...prev,
														{
															...item,
															ascendant: false,
														},
													])
												}
											>
												<Plus size={16} /> {item.title}
											</button>
										))}
								</div>

								<button onClick={applySorting}>Appliquer</button>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
