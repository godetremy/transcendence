import * as z from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { getThrowableSession } from '@/lib/session';
import { createManyEvent } from '@/database/Event';
import { formatDataEvent, formatPrivateEvent } from '@/database/format/Event';
import { parseCsv, parseJson, parseXlsx } from '@/utils/parsing';
import { ImportEventType } from '@/types/Event';
import { getUserFromSession } from '@/database/User';
import { getOrganizationById } from '@/database/Organization';
import { ERRORS_DETAILS } from '@/utils/errors';

export function getExt(file: File): string | null {
	const parts = file.name.split('.');

	if (parts.length === 1) return null;

	return parts[parts.length - 1].toLowerCase();
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	try {
		const { org_id } = await params;
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});

		if (!user) throw ERRORS_DETAILS.account_does_not_exists();
		if (!organization) throw ERRORS_DETAILS.organization_does_not_exist();

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
				const dataJ = await parseJson<ImportEventType>(file);
				const allEventJ = await createManyEvent(
					formatDataEvent(dataJ, organization.id, user.full_name ?? ''),
					{}
				);
				return NextResponse.json(allEventJ.map(formatPrivateEvent<object>));
			case 'csv':
				const dataC = await parseCsv<ImportEventType>(file);
				const allEventC = await createManyEvent(
					formatDataEvent(dataC, organization.id, user.full_name ?? ''),
					{}
				);
				return NextResponse.json(allEventC.map(formatPrivateEvent<object>));
			case 'xlsx':
				const dataX = await parseXlsx<ImportEventType>(file);
				const allEventX = await createManyEvent(
					formatDataEvent(dataX, organization.id, user.full_name ?? ''),
					{}
				);
				return NextResponse.json(allEventX.map(formatPrivateEvent<object>));

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
