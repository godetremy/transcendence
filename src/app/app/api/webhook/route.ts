import { updateBalance } from '@/database/balance';
import { CreateTransaction, getTransaction } from '@/database/transaction';
import { getUserById } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { CheckoutSumupShema } from '@/schema/CheckoutSumupSchema';
import { CheckoutSumup } from '@/types/CheckoutSumup';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import SumUp from '@sumup/sdk';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const client = new SumUp({ apiKey: process.env.SUMUP_API_KEY ?? '' });
const JWKS = createRemoteJWKSet(new URL('https://api.sumup.com/.well-known/jwks.json'));

export async function POST(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const signatureHeader = req.headers.get('x-payload-signature');
		if (!signatureHeader) throw ERRORS_DETAILS.permission_denied();

		try {
			await jwtVerify(signatureHeader, JWKS);
		} catch {
			throw ERRORS_DETAILS.permission_denied();
		}

		const user_id = req.nextUrl.searchParams.get('u');
		if (!user_id) throw ERRORS_DETAILS.missing_parameter();

		const user = await getUserById(user_id, {});
		const session = await getThrowableSession(req);
		if (session.user_id != user_id) throw ERRORS_DETAILS.permission_denied();
		if (!user || !user.balance_id || user.agent) throw ERRORS_DETAILS.does_not_exists('Ce compte');

		const body = await parseBody<CheckoutSumup>(req, CheckoutSumupShema);
		if (body.status != 'SUCCESSFUL') throw ERRORS_DETAILS.permission_denied();
		const checkout = await client.checkouts.get(body.id);

		const checkout_prev = await getTransaction({}, checkout.id!);
		if (checkout_prev) throw ERRORS_DETAILS.permission_denied();
		await CreateTransaction({}, user!.balance_id!, checkout);
		await updateBalance({}, user!.balance_id!, checkout.amount!);
		return NextResponse.json({ sucess: true });
	});
}
