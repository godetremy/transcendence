import { getAlbumById, UpdateAlbum } from '@/database/Album';
import { formatPublicAlbum } from '@/database/format/Album';
import { getOrganizationMemberByFilter } from '@/database/OrganizationMembers';
import { getOrganizationPermissionById } from '@/database/OrganizationPermission';
import { getUserById } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { UpdateAlbumSchema } from '@/schema/AlbumSchema';
import { UpdateAlbumType } from '@/types/album';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ album_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { album_id } = await params;
		const session = await getThrowableSession(req);

		const user = await getUserById(session.user_id, {});
		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();

		const album = await getAlbumById(album_id, {});
		if (album == null) throw ERRORS_DETAILS.album_does_not_exists();

		return NextResponse.json(formatPublicAlbum(album));
	});
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ album_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { album_id } = await params;
		const session = await getThrowableSession(req);

		const user = await getUserById(session.user_id, {});
		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();

		const checkAlbum = await getAlbumById(album_id, {
			events: { include: { organization: true } },
			services: { include: { organization: true } },
		});
		if (checkAlbum == null) throw ERRORS_DETAILS.album_does_not_exists();

		if (
			user.admin == false &&
			checkAlbum.events?.organization.owner_id != user.id &&
			checkAlbum.services?.organization.owner_id != user.id
		) {
			if (checkAlbum.events?.organization_id != null) {
				const member = await getOrganizationMemberByFilter(
					{ organization_id: checkAlbum.events?.organization_id, user_id: user.id },
					{}
				);
				if (member == null || member.permission_id == null) throw ERRORS_DETAILS.member_not_in_organization();
				const permissison = await getOrganizationPermissionById(
					member.permission_id,
					checkAlbum.events?.organization_id,
					{}
				);
				if (permissison == null || permissison.album_update == false) throw ERRORS_DETAILS.permission_denied();
			} else if (checkAlbum.services?.organization_id != null) {
				const member = await getOrganizationMemberByFilter(
					{ organization_id: checkAlbum.services?.organization_id, user_id: user.id },
					{}
				);
				if (member == null || member.permission_id == null) throw ERRORS_DETAILS.member_not_in_organization();
				const permissison = await getOrganizationPermissionById(
					member.permission_id,
					checkAlbum.services?.organization_id,
					{}
				);
				if (permissison == null || permissison.album_update == false) throw ERRORS_DETAILS.permission_denied();
			} else throw ERRORS_DETAILS.organization_does_not_exist();
		}

		const body = await parseBody<UpdateAlbumType>(req, UpdateAlbumSchema);

		const album = await UpdateAlbum(body, album_id, {});
		if (album == null) throw ERRORS_DETAILS.album_does_not_exists();

		return NextResponse.json(formatPublicAlbum(album));
	});
}
