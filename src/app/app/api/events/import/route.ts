import * as z from 'zod';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { NextRequest, NextResponse } from 'next/server';
import { CreateEventSchema } from '@/schema/EventForm';
import { CreateEventType } from '@/types/bde/Event';
import { decrypt } from '@/lib/session';
import { JWTSessionPayload } from '@/types/session/SessionPayload';
import { prisma } from '@/database/prisma/prisma';

export function getExt(file: File): string | null {
	const parts = file.name.split('.');

	if (parts.length === 1) return null;

	return parts[parts.length - 1].toLowerCase();
}

export async function ParseJson(file: File): Promise<CreateEventType[]> {
	const text = await file.text();
	return JSON.parse(text) as CreateEventType[];
}

export async function ParseCsv(file: File): Promise<CreateEventType[]> {
	const text = await file.text();
	const result = Papa.parse<CreateEventType>(text, {
		header: true,
		skipEmptyLines: true,
	});

	return result.data;
}

export async function ParseXlsx(file: File): Promise<CreateEventType[]> {
	const buffer = await file.arrayBuffer();
	const tab = XLSX.read(buffer, { type: 'array' });
	const name = tab.SheetNames[0];
	const data = tab.Sheets[name];

	return XLSX.utils.sheet_to_json<CreateEventType>(data);
}

export async function createEvent(data: CreateEventType[], session: JWTSessionPayload): Promise<NextResponse> {
	for (const line of data) {
		const fields = CreateEventSchema.safeParse({
			title: line.title,
			description: line.description,
			start_at: line.start_at,
			end_at: line.end_at,
			max_inscription: line.max_inscription,
		});
		if (!fields.success) return NextResponse.json({ error: fields.error.issues[0].message }, { status: 400 });

		await prisma.event.create({
			data: {
				author_id: session.user_id,
				title: fields.data.title,
				description: fields.data.description,
				start_at: fields.data.start_at,
				end_at: fields.data.end_at,
				max_inscription: fields.data.max_inscription,
			},
			include: {
				author: {
					include: {
						memberships: true,
					},
				},
				registered: true,
			},
		});
	}
	return NextResponse.json({ error: 'Success' }, { status: 200 });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const cookie = req.cookies.get('session');
		const session = await decrypt(cookie?.value);

		const body = await req.formData();
		const file = body.get('file');
		if (!file || !(file instanceof File)) return NextResponse.json({ error: 'Wrong format' }, { status: 400 });

		const ext = getExt(file);
		const fileCheck = z
			.file()
			.mime([
				'application/json',
				'text/csv',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			]);
		const result = fileCheck.safeParse(file);
		if (!result.success) return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
		switch (ext) {
			case 'json':
				const dataJ = await ParseJson(file);
				return createEvent(dataJ, session);
			case 'csv':
				const dataC = await ParseCsv(file);
				return createEvent(dataC, session);
			case 'xlsx':
				const dataX = await ParseXlsx(file);
				return createEvent(dataX, session);
			default:
				return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
		}
	} catch (err: unknown) {
		console.error(err);
		return new NextResponse('Failed to create event.', {
			status: 500,
		});
	}
}
