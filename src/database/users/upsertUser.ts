import { prisma } from '@/database/prisma/prisma';
import { FortyTwoCursusUserDetails } from '@/types/fortytwo/FortyTwoCursusUserDetails';
import { FortyTwoOauthToken } from '@/types/fortytwo/FortyTwoOauthToken';
import { User } from '@/types/bde/User';

export async function upsertUser(me: FortyTwoCursusUserDetails, authorization: FortyTwoOauthToken): Promise<User> {
	const body = {
		fortytwo_user_id: me.id,
		mail: me.email,
		first_name: me.usual_first_name,
		last_name: me.last_name,
		full_name: me.usual_full_name,
		profile_picture: me.image.link,
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

	return {
		id: row.id,
		mail: row.mail,
		first_name: row.first_name,
		last_name: row.last_name,
		full_name: row.full_name,
		profile_picture: row.profile_picture,
		is_agent: row.is_agent,
		is_agent_verified: row.is_agent_verified,
		memberships_id: row.memberships_id,
		memberships: null,
		oauth_fortytwo_id: row.oauth_fortytwo_id,
	};
}
