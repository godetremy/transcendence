import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/database/User';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getThrowableSession, parseUserId } from '@/lib/session';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	return errorHandler(async () => {
		const session = await getThrowableSession(req);
		const { id } = await params;
		const user_id = parseUserId(id, session);

		if (!user_id.is_me) throw ERRORS_DETAILS.permission_denied();

		const stream = new ReadableStream({
			async start(controller) {
				let isConnected = true;

				req.signal.addEventListener('abort', () => {
					isConnected = false;
				});

				while (isConnected) {
					const user = await getUserById(user_id.id, {});
					if (!user) {
						controller.enqueue(`data: ${JSON.stringify({ error: 'User not found' })}\n\n`);
						controller.close();
						break;
					}

					controller.enqueue(`data: ${JSON.stringify({ approved: user.agent_verified })}\n\n`);

					if (!isConnected) break;
					await new Promise((resolve) => setTimeout(resolve, 5000));
				}
			},
			cancel() {},
		});

		return new NextResponse(stream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
				'X-Accel-Buffering': 'no',
			},
		});
	});
}
