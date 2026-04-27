import { prisma } from '@/database/prisma/prisma';
import { User } from '@/types/database/User';
import { FortyTwoCursusUserDetails } from '@/types/fortytwo/FortyTwoCursusUserDetails';
import { FortyTwoOauthToken } from '@/types/fortytwo/FortyTwoOauthToken';

export async function createUser(me: FortyTwoCursusUserDetails, authorization: FortyTwoOauthToken) {
	await prisma.users.create({
		data: {
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
		},
	});
}

export async function createUserAgent(password: string, mail: string) {
	await prisma.users.create({
		data: {
			fortytwo_user_id: null,
			mail: mail,
			password: password,
			oauth_fortytwo: undefined,
			memberships: undefined,
			oauth_fortytwo_id: null,
			memberships_id: null,
		},
	});
}