import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getThrowableSession } from '@/lib/session';
import { getUserFromSession } from '@/database/User';
import { getOrganizationById } from '@/database/Organization';
import { parseBody } from '@/utils/parsing';
import { ExportFileSchema } from '@/schema/ExportFileShema';
import * as XLSX from 'xlsx';
import { getServicesByFilterToOrganization } from '@/database/Service';
import { formatExportService } from '@/database/format/Service';
import { ExportServiceBodyType } from '@/types/Service';

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

		const body = await parseBody<ExportServiceBodyType>(req, ExportFileSchema);

		const services = await getServicesByFilterToOrganization({}, { organization_id: org_id });
		if (services.length == 0) throw ERRORS_DETAILS.does_not_exists('Ce service');
		const formatServices = services.map(formatExportService);

		let data: string;
		switch (body.type) {
			case 'json':
				data = JSON.stringify(formatServices);
				return new NextResponse(data, {
					headers: {
						'Content-Type': 'application/json',
						'Content-Disposition': `attachment; filename="${body.filename}.json"`,
					},
				});
			case 'csv':
				data = Papa.unparse(formatServices, {
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
				const worksheet = XLSX.utils.json_to_sheet(formatServices);
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
