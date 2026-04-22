import { prisma } from '../prisma/prisma';
import { User } from '@/types/database/User';

export async function deleteAccount(user: User) {
	if (user.id != null) deleteUser(user.id);
	if (user.memberships_id != null) deleteMemberships(user.memberships_id);
	if (user.oauth_fortytwo_id != null) deleteOauthFortyTwo(user.oauth_fortytwo_id);
}

export async function deleteUser(id: string) {
	const value = await prisma.users.delete({
		where: {
			id: id,
		},
		include: {
			memberships: true,
			oauth_fortytwo: true,
		},
	});
	return value;
}

export async function deleteMemberships(memberships_id: string) {
	const value = await prisma.memberships.delete({
		where: {
			id: memberships_id,
		},
	});
	return value;
}

export async function deleteOauthFortyTwo(oauth_fortytwo_id: string) {
	const value = await prisma.oauth_fortytwo.delete({
		where: {
			id: oauth_fortytwo_id,
		},
	});
	return value;
}
