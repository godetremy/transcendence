'use server';
import { prisma } from '@/database/prisma/prisma';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

export async function setAgentName(name: string): Promise<string> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get('session');
		const session = await decrypt(cookie?.value);
		await prisma.users.update({
			where: { id: session.user_id },
			data: { full_name: name },
		});
	} catch (error: unknown) {
		console.error(error);
		return 'Error, failed to set agent name.';
	}
	return 'Agent name set';
}

export async function setAgentReason(reason: string): Promise<string> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get('session');
		const session = await decrypt(cookie?.value);
		await prisma.users.update({
			where: { id: session.user_id },
			data: { reason: reason },
		});
	} catch (error: unknown) {
		console.error(error);
		return 'Error, failed to set agent reason.';
	}
	return 'Agent reason set';
}

export async function setAgentVerified(status: boolean): Promise<string> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get('session');
		const session = await decrypt(cookie?.value);
		await prisma.users.update({
			where: { id: session.user_id },
			data: { is_verified_agent: status },
		});
	} catch (error: unknown) {
		console.error(error);
		return 'Error, failed to set agent status.';
	}
	return 'Agent status set';
}
