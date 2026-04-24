import { prisma } from '@/database/prisma/prisma';
import { FortyTwoCursusUserDetails } from '@/types/fortytwo/FortyTwoCursusUserDetails';
import { FortyTwoOauthToken } from '@/types/fortytwo/FortyTwoOauthToken';

export async function upsertUser(me: FortyTwoCursusUserDetails, authorization: FortyTwoOauthToken): Promise<string> {
	const body = {
		fortytwo_user_id: me.id,
		mail: me.email,
		first_name: me.usual_first_name,
		last_name: me.last_name,
		full_name: me.usual_full_name,
		memberships: {},
	};

	const row = await prisma.users.upsert({
		where: { fortytwo_user_id: me.id },
		create: {
			...body,
			oauth_fortytwo: {
				create: {
					access_token: authorization.access_token,
					refresh_token: authorization.refresh_token,
				},
			},
		},
		update: {
			...body,
			oauth_fortytwo: {
				upsert: {
					update: {
						access_token: authorization.access_token,
						refresh_token: authorization.refresh_token,
					},
					create: {
						access_token: authorization.access_token,
						refresh_token: authorization.refresh_token,
					},
				},
			},
		},
	});

	return row.id;
}
