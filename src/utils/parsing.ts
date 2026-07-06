import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ERRORS_DETAILS } from '@/utils/errors';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

async function parseBody<T>(req: NextRequest, schema: z.ZodSchema): Promise<T> {
	const content_type = req.headers.get('content-type')?.toLowerCase() || 'text/plain';

	let body: object;

	switch (content_type) {
		case 'application/json':
			try {
				body = await req.json();
			} catch {
				throw ERRORS_DETAILS.invalid_body();
			}
			break;
		case 'application/x-www-form-urlencoded':
			try {
				const formData = await req.formData();
				body = Object.fromEntries(formData.entries());
			} catch {
				throw ERRORS_DETAILS.invalid_body();
			}
			break;
		default:
			throw ERRORS_DETAILS.unsupported_content_type();
	}
	const data = schema.safeParse(body);
	if (!data.success) {
		const error = data.error.issues[0];
		const field = error.path[error.path.length - 1].toString();

		if (error.code === 'invalid_type') throw ERRORS_DETAILS.missing_parameter(field);
		throw ERRORS_DETAILS.invalid_parameter(field);
	}

	return data.data as T;
}

const parseParams = <T>(param: URLSearchParams, schema: z.ZodObject): T => {
	const fields = Object.keys(schema.shape);

	let tab: object = {};
	for (const field of fields) {
		tab = { ...tab, ...Object({ [field]: param.get(field) }) };
	}

	const data = schema.safeParse(tab);

	if (!data.success) {
		const error = data.error.issues[0];
		const field = error.path[error.path.length - 1].toString();

		if (error.code === 'invalid_type') throw ERRORS_DETAILS.missing_parameter(field);
		throw ERRORS_DETAILS.invalid_parameter(field);
	}

	return tab as T;
};

const parseJson = async <T>(file: File): Promise<T[]> => {
	const text = await file.text();
	return JSON.parse(text) as T[];
};

const parseCsv = async <T>(file: File): Promise<T[]> => {
	const text = await file.text();
	const result = Papa.parse<T>(text, {
		header: true,
		skipEmptyLines: true,
	});

	return result.data;
};

const parseXlsx = async <T>(file: File): Promise<T[]> => {
	const buffer = await file.arrayBuffer();
	const tab = XLSX.read(buffer, { type: 'array' });
	const name = tab.SheetNames[0];
	const data = tab.Sheets[name];

	return XLSX.utils.sheet_to_json<T>(data);
};

export { parseBody, parseParams, parseCsv, parseJson, parseXlsx };
