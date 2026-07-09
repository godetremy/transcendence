import { formatPublicService } from '@/database/format/Service';
import { createViewElasticSearch } from '@/database/prisma/elasticSearch';
import { getServicesById } from '@/database/Service';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ service_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { service_id } = await params;

		const service_value = await getServicesById(service_id, { organization: true, category: true });
		if (service_value === null) throw ERRORS_DETAILS.service_does_not_exists();

		createViewElasticSearch(service_value.organization_id, service_id);

		return NextResponse.json(formatPublicService<{ organization: true; category: true }>(service_value));
	});
}
