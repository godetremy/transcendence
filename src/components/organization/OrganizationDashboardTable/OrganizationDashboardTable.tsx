'use client';
import styles from './component.module.scss';
import { Checkbox } from '@/components/globals/Checkbox/Checkbox';
import { Search, Filter, ArrowUpDown, Settings2, List, LayoutGrid, DownloadCloud, CloudUploadIcon } from 'lucide-react';
import { ReactNode } from 'react';
import OrganizationTableHeaderButton from '@/components/organization/OrganizationTableHeaderButton/OrganizationTableHeaderButton';
import {
	OrganizationDashboardHeader,
	OrganizationDashboardHeaderProps,
} from '@/components/organization/OrganizationDashboardHeader/OrganizationDashboardHeader';

export interface OrganizationDashboardTableColumn {
	text: string;
	width?: number;
}

export interface OrganizationDashboardTable {
	header: OrganizationDashboardHeaderProps;
	column: OrganizationDashboardTableColumn[];
	data: Array<ReactNode[]>;
}

export function OrganizationDashboardTable(props: OrganizationDashboardTable) {
	return (
		<section className={styles.main_container}>
			<div className={styles.fixed_header}>
				<OrganizationDashboardHeader {...props.header} />
				<div className={styles.filter_container}>
					<div className={styles.searchInput}>
						<Search />
						<input type={'text'} placeholder={'Rechercher un événement'} />
					</div>
					<button>
						<Filter />
					</button>
					<button>
						<ArrowUpDown />
					</button>
					<button>
						<Settings2 />
					</button>
					<button>
						<List />
					</button>
					<button>
						<LayoutGrid />
					</button>
					<OrganizationTableHeaderButton icon={<CloudUploadIcon size={20} />} text={'Importer'} />
					<OrganizationTableHeaderButton icon={<DownloadCloud size={20} />} text={'Exporter'} />
				</div>
			</div>
			<table className={styles.table}>
				<thead>
					<tr>
						<th scope="col" style={{ minWidth: 30, justifyContent: 'center' }}>
							<Checkbox />
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
					{props.data.map((row, i) => (
						<tr key={i}>
							<td scope="row" style={{ minWidth: 30, justifyContent: 'center' }}>
								<Checkbox />
							</td>
							{row.map((column, i) => (
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
						</tr>
					))}
				</tbody>
			</table>
		</section>
	);
}
