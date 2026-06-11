import * as z from 'zod';
import { NextRequest, NextResponse } from 'next/server';

export function getExt(file: File): string | null {
	const parts = file.name.split('.');

	if (parts.length === 1) return null;

	return parts[parts.length - 1].toLowerCase();
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const body = await req.formData();
		const file = body.get('file');
		if (!file || !(file instanceof File)) return NextResponse.json('Error, no valid file.', { status: 400 });

		const ext = getExt(file);
		const fileCheck = z.file();
		switch (ext) {
			case 'json':
				fileCheck.mime('application/json');
				break;
			case 'csv':
				fileCheck.mime('text/csv');
				break;
			case 'xlsx':
				fileCheck.mime('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
				break;
			default:
				return NextResponse.json('Error, Invalid format', { status: 400 });
		}
		return NextResponse.json('Success', { status: 200 });
	} catch (err: unknown) {
		console.error(err);
		return new NextResponse('Error, failed to create event.', {
			status: 500,
		});
	}
}
