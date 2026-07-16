import { NextRequest, NextResponse } from 'next/server';
import { getThrowableSession } from '@/lib/session';
import { createManyEvent } from '@/database/Event';
import { formatDataEvent, formatPrivateEvent } from '@/database/format/Event';
import { parseCsv, parseJson, parseXlsx } from '@/utils/parsing';
import { ImportEventType } from '@/types/Event';
import { getUserFromSession } from '@/database/User';
import { getOrganizationById } from '@/database/Organization';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { ImportFileSchema } from '@/schema/ImportFileShema';
import { CreateEventSchema } from '@/schema/EventSchema';

export function getExt(file: File): string | null {
	const parts = file.name.split('.');

	if (parts.length === 1) return null;

	return parts[parts.length - 1].toLowerCase();
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});

		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');
		if (!organization) throw ERRORS_DETAILS.does_not_exists('Cette organisation');

		const body = await req.formData();
		const file = body.get('file');
		if (!file || !(file instanceof File)) throw ERRORS_DETAILS.invalid_parameter('fichier');

		const ext = getExt(file);

		const result = ImportFileSchema.safeParse(file);
		if (!result.success) throw ERRORS_DETAILS.invalid_parameter(result.error.issues[0].message);

		let data: ImportEventType[];
		switch (ext) {
			case 'json':
				data = await parseJson<ImportEventType>(file);
				break;
			case 'csv':
				data = await parseCsv<ImportEventType>(file);
				break;
			case 'xlsx':
				data = await parseXlsx<ImportEventType>(file);
				break;

			default:
				return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
		}

		const checkData = formatDataEvent(data, organization.id, user.full_name ?? '');
		if (checkData.length == 0) throw ERRORS_DETAILS.invalid_parameter('fichier');
		for (const row of checkData) {
			const checkRow = CreateEventSchema.safeParse(row);
			if (!checkRow.success) throw ERRORS_DETAILS.invalid_parameter(checkRow.error.issues[0].message);
		}

		const listEvent = await createManyEvent(formatDataEvent(data, organization.id, user.id), {});
		return NextResponse.json(listEvent.map(formatPrivateEvent<object>));
	});
}
