import { formatTransaction } from '@/database/format/Transaction';
import { countTransaction, getTransactions } from '@/database/transaction';
import { getUserById } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string; balance_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id, balance_id } = await params;
		const session = await getThrowableSession(req);
		if (session.user_id != id) ERRORS_DETAILS.permission_denied();
		const user = await getUserById(session.user_id, {});
		if (!user || user.balance_id != balance_id) ERRORS_DETAILS.account_does_not_exists();

		const pagination = getPaginationParams(req.nextUrl.searchParams);
		const number = await countTransaction(balance_id);
		const list = await getTransactions({}, balance_id, pagination);

		console.log(balance_id, list, number);
		return NextResponse.json(generatePaginationResponse(list.map(formatTransaction), number, pagination));
	});
}
