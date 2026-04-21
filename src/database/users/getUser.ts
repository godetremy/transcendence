import { prisma } from '@/database/prisma/prisma';
import { memberships } from '@/types/database/memberships';

export async function getUserByFortyTwoUserId(id: string): Promise<memberships | null> {
	const row = await prisma.users.findUnique({
		where: {
			id: id,
		},
		include: {
			memberships: true,
		},
	});
	if (row != null) {
		const value: memberships = {
			id: row.id,
			mail: row.mail,
			first_name: row.first_name,
			last_name: row.last_name,
			full_name: row.full_name,
			is_agent: row.is_agent,
			memberships_id: row.memberships_id,
			start_at: row.memberships?.start_at.getDate(),
			end_at: row.memberships?.end_at.getDate(),
		};
		return value;
	}
	return null;
}
