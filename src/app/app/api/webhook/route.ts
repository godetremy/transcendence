import { updateBalance } from '@/database/balance';
import { CreateTransaction, getTransaction } from '@/database/transaction';
import { getUserById } from '@/database/User';
import { CheckoutSumupShema } from '@/schema/CheckoutSumupSchema';
import { CheckoutSumup } from '@/types/CheckoutSumup';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import SumUp from '@sumup/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new SumUp({ apiKey: process.env.SUMUP_API_KEY ?? '' });

export async function POST(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const user_id = req.nextUrl.searchParams.get('u');
		if (!user_id) ERRORS_DETAILS.missing_parameter();

		const user = await getUserById(user_id!, {});
		if (!user || !user.balance_id || user.agent) ERRORS_DETAILS.does_not_exists('Ce compte');

		const body = await parseBody<CheckoutSumup>(req, CheckoutSumupShema);
		if (body.status != 'SUCCESSFUL') ERRORS_DETAILS.permission_denied();
		const checkout = await client.checkouts.get(body.id);

		const checkout_prev = await getTransaction({}, checkout.id!);
		if (checkout_prev) throw ERRORS_DETAILS.permission_denied();
		await CreateTransaction({}, user!.balance_id!, checkout);
		await updateBalance({}, user!.balance_id!, checkout.amount!);
		return NextResponse.json({ sucess: true });
	});
}
