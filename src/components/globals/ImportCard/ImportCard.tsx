'use client';
import styles from './component.module.scss';
import { Fragment, useCallback, useState } from 'react';
import { Card } from '@/components/globals/Card/Card';
import { CardHeader } from '@/components/globals/CardHeader/CardHeader';
import {
	CloudUpload,
	FileSpreadsheet,
	FileJson,
	FileText,
	CircleAlert,
	RotateCcw,
	ArrowRight,
	ChevronDown,
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Loader } from '@/components/globals/Loader/Loader';
import { CircleLoader } from '@/components/globals/CircleLoader/CircleLoader';
import { ACCEPTED_FILETYPES, parseFile, SpreadsheetData } from '@/utils/file';
import Image from 'next/image';

enum ImportCardPage {
	UPLOAD,
	LINK_FIELDS,
	CREATE_RECORDS,
	DONE,
}

export interface ImportCardTargetField {
	id: string;
	text: string;
	required?: boolean;
}

export interface ImportCardProps {
	visible: boolean;
	requestClose: () => void;
	columns: ImportCardTargetField[];
	onImport: (rows: Record<string, string>) => void | Promise<void>;
	loading?: boolean;
}

export function ImportCard({ visible, requestClose, columns, onImport, loading }: ImportCardProps) {
	const [page, setPage] = useState<ImportCardPage>(ImportCardPage.UPLOAD);

	const [parseError, setParseError] = useState<string | null>(null);
	const [filename, setFilename] = useState<string | null>(null);

	const [parsed, setParsed] = useState<SpreadsheetData | null>(null);
	const [mapping, setMapping] = useState<Record<string, string>>({});
	const [requiredFieldsSet, setRequiredFieldsSet] = useState<boolean>(false);

	const [rowImported, setRowImported] = useState<number>(0);
	const [importError, setImportError] = useState<{ line: number; details: string }[]>([]);

	const onDrop = useCallback(async (accepted: File[]) => {
		const file = accepted[0];
		if (!file) return;

		setParsed(null);
		setParseError(null);
		setMapping({});
		setFilename(file.name);

		try {
			const data = await parseFile(file);

			if (data.headers.length === 0 || data.rows.length === 0) {
				setParseError('Le fichier est vide.');
				return;
			}

			setParsed(data);
			setPage(ImportCardPage.LINK_FIELDS);
		} catch (e) {
			setParseError(e instanceof Error ? e.message : 'Impossible de lire le fichier.');
		}
	}, []);

	const dropzone = useDropzone({
		onDrop,
		accept: ACCEPTED_FILETYPES,
		maxFiles: 1,
		multiple: false,
		disabled: loading,
	});

	const updateFieldMapping = (column: string, field: string) => {
		const m = { ...mapping, [column]: field };
		setMapping(m);

		const fields = Object.values(m);
		const hasAllRequiredFields = columns
			.filter((column) => column.required)
			.every((column) => fields.includes(column.id));

		setRequiredFieldsSet(hasAllRequiredFields);
	};

	const getIndexForColumn = (column: string) => {
		const index = parsed?.headers.indexOf(column);
		return index ?? -1;
	};

	const importRows = async () => {
		if (!parsed) return;
		setPage(ImportCardPage.CREATE_RECORDS);

		for (let i = 0; i < parsed.rows.length; i++) {
			const row = parsed.rows[i];
			const object: Record<string, string> = {};

			Object.keys(mapping).forEach((column) => {
				const index = getIndexForColumn(column);
				if (index === -1) {
					setImportError((prev) => [...prev, { line: i + 1, details: `Colonne ${column} introuvable` }]);
				}
				object[column] = row[index];
			});

			try {
				await onImport(object);
			} catch (e) {
				setImportError((prev) => [
					...prev,
					{ line: i + 1, details: e instanceof Error ? e.message : 'Erreur inconnue' },
				]);
			}

			setRowImported((prev) => prev + 1);
		}

		setPage(ImportCardPage.DONE);
	};

	const reset = () => {
		setPage(ImportCardPage.UPLOAD);
		setParsed(null);
		setParseError(null);
		setFilename(null);
		setMapping({});
		setRequiredFieldsSet(false);
		setRowImported(0);
		setImportError([]);
	};

	const handleClose = () => {
		reset();
		requestClose();
	};

	const fileIcon = (() => {
		const extension = (filename ?? '').toLowerCase().split('.').pop();
		switch (extension) {
			case 'json':
				return <FileJson size={28} />;
			case 'xls':
			case 'xlsx':
				return <FileSpreadsheet size={28} />;
			default:
				return <FileText size={28} />;
		}
	})();

	return (
		<Card visible={visible} requestClose={handleClose}>
			<section className={styles.main_container}>
				<CardHeader title={'Importer des données'} onClose={handleClose} loading={loading} />

				{page === ImportCardPage.UPLOAD && (
					<div
						{...dropzone.getRootProps()}
						className={`${styles.dropzone} ${dropzone.isDragActive ? styles.dropzone_active : ''}`}
					>
						<input {...dropzone.getInputProps()} />
						<CloudUpload size={48} />
						<h3>{dropzone.isDragActive ? 'Dépose le fichier ici…' : 'Glisse un fichier ici'}</h3>
						<p>Formats acceptés : CSV, XLS, XLSX, JSON</p>
						{parseError && (
							<span className={styles.parse_error}>
								<CircleAlert size={16} /> {parseError}
							</span>
						)}
						{loading && (
							<span className={styles.loading}>
								<Loader size={20} /> Import en cours…
							</span>
						)}
					</div>
				)}

				{page === ImportCardPage.LINK_FIELDS && parsed && (
					<div className={styles.link_fields_page}>
						<div className={styles.file_info}>
							{fileIcon}
							<div>
								<strong>{filename}</strong>
								<span>
									{parsed.rows.length} lignes · {parsed.headers.length} colonnes
								</span>
							</div>
							<button type="button" className={styles.reset_button} onClick={reset} disabled={loading}>
								<RotateCcw size={16} /> Changer de fichier
							</button>
						</div>

						<ul className={styles.fields_container}>
							{parsed.headers.map((target, i) => (
								<li key={i}>
									<code>{target}</code>
									<ArrowRight size={20} />
									<select
										value={mapping[target] ?? 'none'}
										onChange={(e) => updateFieldMapping(target, e.target.value)}
									>
										<option value="none">Ignorer</option>
										{columns.map((source) => (
											<option
												key={source.id}
												value={source.id}
												disabled={Object.values(mapping).includes(source.id)}
											>
												{source.text}
											</option>
										))}
									</select>
								</li>
							))}
						</ul>

						<button disabled={!requiredFieldsSet} onClick={importRows} className={styles.primary_button}>
							Importer {parsed.rows.length} élément{parsed.rows.length > 1 ? 's' : ''}
						</button>
					</div>
				)}

				{page === ImportCardPage.CREATE_RECORDS && parsed && (
					<div className={styles.create_records_page}>
						<div>
							<p>
								{rowImported}
								<span>
									<br />
									{parsed.rows.length}
								</span>
							</p>
							<CircleLoader progress={rowImported / parsed.rows.length} size={120} strokeWidth={4} />
						</div>
						<h2>Importation des éléments</h2>
						<p>Cela peu prendre un moment...</p>
					</div>
				)}

				{page === ImportCardPage.DONE && parsed && (
					<div className={styles.done_page}>
						<Image src={'/images/ok.svg'} alt={'Succès'} width={120} height={120} />
						<h2>C&#39;est dans la boîte</h2>
						<p>
							{parsed.rows.length - importError.length} élément
							{parsed.rows.length - importError.length > 1 ? 's' : ''} importée
							{parsed.rows.length - importError.length > 1 ? 's' : ''}
						</p>

						{importError.length > 0 && (
							<details>
								<summary>
									<CircleAlert size={20} /> {importError.length} erreur
									{importError.length > 1 ? 's' : ''}{' '}
									<ChevronDown size={20} className={styles.chevron} />
								</summary>
								<div>
									{importError.map((e, i) => (
										<Fragment key={i}>
											<p>
												<strong>Ligne {e.line}</strong>
												<span> — </span>
												{e.details}
											</p>
										</Fragment>
									))}
								</div>
							</details>
						)}

						<button className={styles.primary_button} onClick={handleClose}>
							Fermer
						</button>
					</div>
				)}
			</section>
		</Card>
	);
}
