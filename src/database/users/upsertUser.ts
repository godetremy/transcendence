import { prisma } from '@/database/prisma/prisma';
import { FortyTwoCursusUserDetails } from '@/types/FortyTwoCursusUserDetails';
import { FortyTwoOauthToken } from '@/types/FortyTwoOauthToken';

export async function upsertUser(me: FortyTwoCursusUserDetails, authorization: FortyTwoOauthToken) {
	const body = {
		fortytwo_user_id: me.id,
		mail: me.email,
		first_name: me.usual_first_name,
		last_name: me.last_name,
		full_name: me.usual_full_name,
		oauth_fortytwo: {
			create: {
				access_token: authorization.access_token,
				refresh_token: authorization.refresh_token,
			},
		},
		memberships: {
			create: {},
		},
	};

	await prisma.users.upsert({
		where: { fortytwo_user_id: me.id },
		create: body,
		update: body,
	});
}
