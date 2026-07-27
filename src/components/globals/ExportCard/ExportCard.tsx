'use client';
import styles from './component.module.scss';
import { ForwardRefExoticComponent, RefAttributes, useCallback, useMemo, useState } from 'react';
import { Card } from '@/components/globals/Card/Card';
import { CardHeader } from '@/components/globals/CardHeader/CardHeader';
import { FileSpreadsheet, FileJson, FileText, LucideProps } from 'lucide-react';
import { Loader } from '@/components/globals/Loader/Loader';

export interface ExportFormat {
	id: string;
	label: string;
	description: string;
	softwares: string;
	icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
}

export interface ExportCardProps {
	visible: boolean;
	requestClose: () => void;
	onExport: (formatId: string) => void | Promise<void>;
	loading?: boolean;
	formats?: ExportFormat[];
}

const DEFAULT_FORMATS: ExportFormat[] = [
	{
		id: 'csv',
		label: 'CSV',
		description: 'Fichier texte délimité par des virgules. Idéal pour une utilisation basique des données.',
		softwares: 'Excel, Google Sheets, Numbers',
		icon: FileText,
	},
	{
		id: 'xlsx',
		label: 'XLSX',
		description:
			'Feuille de calcul Microsoft Excel. Idéal si le fichier compte être utilisé dans un tableur intégrant la mise en forme, les formules, et les feuilles.',
		softwares: 'Excel, Google Sheets, Numbers',
		icon: FileSpreadsheet,
	},
	{
		id: 'json',
		label: 'JSON',
		description:
			'Données structurées et indexées par clés. Intéressant pour intégrer les données dans une applications tierce. Option recommandée aux développeurs.',
		softwares: 'API, scripts, outils de developpeurs',
		icon: FileJson,
	},
];

export function ExportCard({ visible, requestClose, onExport, loading, formats }: ExportCardProps) {
	const list = useMemo(() => formats ?? DEFAULT_FORMATS, [formats]);
	const [selected, setSelected] = useState<string>(list[0]?.id ?? '');

	const handleClose = useCallback(() => {
		if (!loading) requestClose();
	}, [loading, requestClose]);

	const handleConfirm = useCallback(async () => {
		if (!selected || loading) return;
		await onExport(selected);
	}, [selected, loading, onExport]);

	return (
		<Card visible={visible} requestClose={handleClose}>
			<section className={styles.main_container}>
				<CardHeader title={'Exporter des données'} onClose={handleClose} />
				<div className={styles.formats_container}>
					{list.map((format) => {
						const isSelected = format.id === selected;
						return (
							<button
								key={format.id}
								type="button"
								className={`${styles.format_card} ${isSelected ? styles.format_card_selected : ''}`}
								onClick={() => !loading && setSelected(format.id)}
								disabled={loading}
							>
								<span className={styles.format_icon}>
									<format.icon size={22} />
								</span>
								<span className={styles.format_body}>
									<span className={styles.format_title}>{format.label}</span>
									<span className={styles.format_description}>{format.description}</span>
									<span className={styles.format_softwares}>
										<strong>Recommendations :</strong> {format.softwares}
									</span>
								</span>
							</button>
						);
					})}
				</div>
				<button
					type="button"
					className={styles.confirm_pill}
					onClick={handleConfirm}
					disabled={!selected || loading}
				>
					{loading && <Loader size={22} />}
					{loading ? 'Export en cours…' : 'Exporter'}
				</button>
			</section>
		</Card>
	);
}
