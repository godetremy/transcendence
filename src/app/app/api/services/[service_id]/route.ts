import { formatPublicService } from '@/database/format/Service';
import { getServicesById } from '@/database/Service';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ service_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { service_id } = await params;

		const event_value = await getServicesById(service_id, { organization: true, category: true });
		if (event_value === null) throw ERRORS_DETAILS.service_does_not_exists();

		return NextResponse.json(formatPublicService<{ organization: true; category: true }>(event_value));
	});
}
