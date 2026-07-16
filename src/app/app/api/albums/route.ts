import { countAlbumByFilter, createAlbum, getAlbumsByFilter } from '@/database/Album';
import { getEventById } from '@/database/Event';
import { formatPrivateAlbum } from '@/database/format/Album';
import { getOrganizationById } from '@/database/Organization';
import { getServicesById } from '@/database/Service';
import { getUserById } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { CreateAlbumSchema } from '@/schema/AlbumSchema';
import { CreateAlbumType } from '@/types/album';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { parseBody } from '@/utils/parsing';
import { getUserOrganizationPermission } from '@/utils/permission';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const searchParams = req.nextUrl.searchParams;

		const pagination = getPaginationParams(searchParams);
		const session = await getThrowableSession(req);
		const user = await getUserById(session.user_id, {});
		if (user == null) throw ERRORS_DETAILS.does_not_exists('Ce compte');
		if (!user.admin) throw ERRORS_DETAILS.permission_denied();

		const count = await countAlbumByFilter({});
		const value = await getAlbumsByFilter({}, {}, pagination);

		return NextResponse.json(generatePaginationResponse(value.map(formatPrivateAlbum), count, pagination));
	});
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const session = await getThrowableSession(req);
		const user = await getUserById(session.user_id, {});
		if (user == null) throw ERRORS_DETAILS.does_not_exists('Ce compte');

		const body = await parseBody<CreateAlbumType>(req, CreateAlbumSchema);

		let organization = null;
		if (body.event_id != null) {
			const event = await getEventById(body.event_id, {});
			if (event == null) throw ERRORS_DETAILS.does_not_exists('Cet événement');
			organization = await getOrganizationById(event.organization_id, {});
		}
		if (body.service_id != null) {
			const service = await getServicesById(body.service_id, {});
			if (service == null) throw ERRORS_DETAILS.does_not_exists('Ce service');
			organization = await getOrganizationById(service.organization_id, {});
		}
		if (body.event_id == null && body.service_id == null) throw ERRORS_DETAILS.missing_parameter();

		if (organization == null) throw ERRORS_DETAILS.does_not_exists('Cette organisation');

		const user_permission = await getUserOrganizationPermission(user, organization.id, true);
		if (!user_permission.album_create) throw ERRORS_DETAILS.permission_denied();

		const album = await createAlbum(body, { events: true, services: true });
		if (album == null) throw ERRORS_DETAILS.does_not_exists('Cet album');

		return NextResponse.json(formatPrivateAlbum(album));
	});
}
