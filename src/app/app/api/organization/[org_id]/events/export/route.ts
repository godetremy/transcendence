import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getThrowableSession } from '@/lib/session';
import { getUserFromSession } from '@/database/User';
import { getOrganizationById } from '@/database/Organization';
import { parseBody } from '@/utils/parsing';
import { ExportEventBodyType } from '@/types/Event';
import { ExportFileSchema } from '@/schema/ExportFileShema';
import { getEventsByFilterToOrganization } from '@/database/Event';
import { formatExportEvent } from '@/database/format/Event';
import * as XLSX from 'xlsx';

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});

		if (!user) throw ERRORS_DETAILS.account_does_not_exists();
		if (!organization) throw ERRORS_DETAILS.organization_does_not_exist();

		const body = await parseBody<ExportEventBodyType>(req, ExportFileSchema);

		const events = await getEventsByFilterToOrganization({ organization_id: org_id }, {});
		if (events.length == 0) throw ERRORS_DETAILS.event_does_not_exists();
		const formatEvents = events.map(formatExportEvent);

		let data: string;
		switch (body.type) {
			case 'json':
				data = JSON.stringify(formatEvents);
				return new NextResponse(data, {
					headers: {
						'Content-Type': 'application/json',
						'Content-Disposition': `attachment; filename="${body.filename}.json"`,
					},
				});
			case 'csv':
				data = Papa.unparse(formatEvents, {
					header: true,
					delimiter: ',',
				});
				return new NextResponse(data, {
					headers: {
						'Content-Type': 'text/csv',
						'Content-Disposition': `attachment; filename="${body.filename}.csv"`,
					},
				});
			case 'xlsx':
				const worksheet = XLSX.utils.json_to_sheet(formatEvents);
				const workbook = XLSX.utils.book_new();

				XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
				const buffer = XLSX.write(workbook, {
					type: 'buffer',
					bookType: 'xlsx',
				});
				return new NextResponse(buffer, {
					headers: {
						'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
						'Content-Disposition': `attachment; filename="${body.filename}.xlsx"`,
					},
				});

			default:
				return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
		}
	});
}
