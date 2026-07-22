import { Accept } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const ACCEPTED_FILETYPES: Accept = {
	'text/csv': ['.csv'],
	'application/vnd.ms-excel': ['.xls'],
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
	'application/json': ['.json'],
};

interface SpreadsheetData {
	headers: string[];
	rows: string[][];
}

const readFile = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(new Error('Impossible de lire le fichier.'));
		reader.readAsText(file);
	});
};

const parseCSV = (file: File): Promise<SpreadsheetData> => {
	return new Promise((resolve, reject) => {
		Papa.parse<string[]>(file, {
			skipEmptyLines: true,
			complete: (res) => {
				const rows = (res.data as string[][]).map((r) => r.map((c) => (c == null ? '' : String(c))));
				if (rows.length === 0) return resolve({ headers: [], rows: [] });
				resolve({ headers: rows[0] ?? [], rows: rows.slice(1) });
			},
			error: reject,
		});
	});
};

const parseXLSX = async (file: File): Promise<SpreadsheetData> => {
	const content = await readFile(file);

	try {
		const wb = XLSX.read(content, { type: 'array' });
		const sheet = wb.Sheets[wb.SheetNames[0]];

		const matrix = XLSX.utils.sheet_to_json<string[]>(sheet, {
			header: 1,
			blankrows: false,
			defval: '',
		}) as string[][];

		if (matrix.length === 0) return { headers: [], rows: [] };
		return { headers: matrix[0] ?? [], rows: matrix.slice(1) };
	} catch (e) {
		throw e instanceof Error ? e : new Error("Ce fichier n'est pas un fichier XLS valide.");
	}
};

const parseJSON = async (file: File): Promise<SpreadsheetData> => {
	const content = await readFile(file);

	try {
		const json: unknown = JSON.parse(content);
		let records: Record<string, unknown>[] = [];

		if (Array.isArray(json)) {
			records = json.filter((r) => r != null) as Record<string, unknown>[];
		} else if (json && typeof json === 'object') {
			records = [json as Record<string, unknown>];
		}
		const headers = Array.from(new Set(records.flatMap((r) => Object.keys(r))));
		const rows = records.map((r) => headers.map((h) => (r[h] == null ? '' : String(r[h]))));

		return { headers, rows };
	} catch (e) {
		throw e instanceof Error ? e : new Error("Ce fichier n'est pas un fichier JSON valide.");
	}
};

const parseFile = (file: File): Promise<SpreadsheetData> => {
	const filename = file.name.toLowerCase();
	const extension = filename.split('.').pop();

	switch (extension) {
		case 'csv':
			return parseCSV(file);
		case 'xls':
		case 'xlsx':
			return parseXLSX(file);
		case 'json':
			return parseJSON(file);
		default:
			throw new Error("Ce fichier n'est pas supporté.");
	}
};

export { ACCEPTED_FILETYPES, parseFile };
export type { SpreadsheetData };
