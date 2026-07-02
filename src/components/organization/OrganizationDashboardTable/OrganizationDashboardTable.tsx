'use client';
import styles from './component.module.scss';
import { Checkbox } from '@/components/globals/Checkbox/Checkbox';
import { Search, Filter, ArrowUpDown, Settings2, DownloadCloud, CloudUploadIcon, Plus } from 'lucide-react';
import { ReactNode, useState } from 'react';
import OrganizationTableHeaderButton from '@/components/organization/OrganizationTableHeaderButton/OrganizationTableHeaderButton';
import {
	OrganizationDashboardHeader,
	OrganizationDashboardHeaderProps,
} from '@/components/organization/OrganizationDashboardHeader/OrganizationDashboardHeader';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'motion/react';
import { Loader } from '@/components/globals/Loader/Loader';
import { EmptyState } from '@/components/globals/EmptyState/EmptyState';

export interface OrganizationDashboardTableColumn {
	text: string;
	width?: number;
}

export interface OrganizationDashboardTable {
	header: OrganizationDashboardHeaderProps;
	column: OrganizationDashboardTableColumn[];
	data: Array<{ key: string; children: ReactNode[] }>;
	onImport?: () => void;
	onExport?: () => void;
	onNew?: () => void;
	loading?: boolean;
}

export function OrganizationDashboardTable(props: OrganizationDashboardTable) {
	const [selected, setSelected] = useState<number[]>([]);

	const toggleSelectAll = (checked: boolean) => {
		if (checked) {
			const selection: number[] = [];
			for (let i = 0; i < props.data.length; i++) {
				selection.push(i);
			}
			setSelected(selection);
			return;
		}
		setSelected([]);
	};

	return (
		<section className={styles.main_container}>
			<div className={styles.fixed_header}>
				<OrganizationDashboardHeader {...props.header} />
				<div className={styles.header_container}>
					<div className={styles.search_bar}>
						<Search size={22} />
						<input type={'text'} placeholder={'Rechercher un événement'} />
					</div>
					<div className={styles.filters_options}>
						<button>
							<Filter size={22} />
						</button>
						<button>
							<ArrowUpDown size={22} />
						</button>
						<button>
							<Settings2 size={22} />
						</button>
					</div>
					<div className={styles.actions_buttons}>
						{props.onImport && (
							<OrganizationTableHeaderButton
								icon={CloudUploadIcon}
								text={'Importer'}
								onClick={props.onImport}
							/>
						)}
						{props.onExport && (
							<OrganizationTableHeaderButton
								icon={DownloadCloud}
								text={'Exporter'}
								onClick={props.onExport}
							/>
						)}
						{props.onNew && (
							<OrganizationTableHeaderButton
								icon={Plus}
								text={'Nouveau'}
								primary={true}
								onClick={props.onNew}
							/>
						)}
					</div>
				</div>
			</div>
			<table className={styles.table}>
				<thead>
					<tr>
						<th scope="col" style={{ minWidth: 30, justifyContent: 'center' }}>
							<Checkbox onChange={(e) => toggleSelectAll(e.target.checked)} />
						</th>
						{props.column.map((column, i) => (
							<th
								scope="col"
								key={i}
								className={styles.table_header_column}
								style={{
									...(column.width
										? { minWidth: props.column[i].width, maxWidth: props.column[i].width }
										: { flex: 1, minWidth: 500 }),
									justifyContent: i <= 0 ? 'center' : 'flex-start',
								}}
							>
								{column.text}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					<AnimatePresence>
						{props.data.map((row, i) => (
							<motion.tr
								key={row.key}
								initial={{ opacity: 0, marginTop: -60 }}
								animate={{ opacity: 1, marginTop: 0 }}
								exit={{ opacity: 0, marginTop: -60 }}
							>
								<td scope="row" style={{ minWidth: 30, justifyContent: 'center' }}>
									<Checkbox
										checked={selected.includes(i)}
										onChange={(e) =>
											e.currentTarget.checked
												? setSelected([...selected, i])
												: setSelected(selected.filter((id) => id !== i))
										}
									/>
								</td>
								{row.children.map((column, i) => (
									<td
										key={i}
										style={{
											...(props.column[i].width
												? {
														minWidth: props.column[i].width,
														maxWidth: props.column[i].width,
													}
												: { flex: 1, minWidth: 500 }),
											justifyContent: i <= 0 ? 'center' : 'flex-start',
										}}
									>
										{column}
									</td>
								))}
							</motion.tr>
						))}
					</AnimatePresence>
				</tbody>
			</table>
			{props.data.length === 0 && !props.loading && <EmptyState />}
			{props.loading && (
				<span className={styles.loading_container}>
					<Loader size={20} />
					Chargement des données...
				</span>
			)}
		</section>
	);
}
