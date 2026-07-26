import { formatBalance } from '@/database/format/Balance';
import { getUserById } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { SumupCreateCheckoutsSchema } from '@/schema/SumupCreateCheckoutsSchema';
import { SumupCreateCheckouts } from '@/types/SumupCreateCheckouts';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import SumUp from '@sumup/sdk';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const client = new SumUp({ apiKey: process.env.SUMUP_API_KEY ?? '' });

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const session = await getThrowableSession(req);
		if (session.user_id != id) throw ERRORS_DETAILS.permission_denied();
		const user = await getUserById(session.user_id, {});
		if (!user || !user.balance_id) throw ERRORS_DETAILS.does_not_exists('Ce compte');

		const body = await parseBody<SumupCreateCheckouts>(req, SumupCreateCheckoutsSchema);
		const reference = randomUUID();
		const checkout = await client.checkouts.create({
			amount: body.amount,
			checkout_reference: reference,
			currency: 'EUR',
			merchant_code: process.env.SUMUP_MERCHANT_CODE ?? '',
			description: 'Rechargement du solde',
			redirect_url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/app/me/membership`,
			return_url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/app/api/webhook?u=${session.user_id}`,
			hosted_checkout: { enabled: true },
		});

		if (!checkout.hosted_checkout_url) throw ERRORS_DETAILS.sumup_does_not_exist_url();
		return NextResponse.json({ success: true, redirect_url: checkout.hosted_checkout_url });
	});
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const session = await getThrowableSession(req);
		if (session.user_id != id) throw ERRORS_DETAILS.permission_denied();
		const user = await getUserById(session.user_id, { balance: true });
		if (!user || !user.balance) throw ERRORS_DETAILS.does_not_exists('Ce compte');

		return NextResponse.json(formatBalance(user.balance));
	});
}
