import { post } from './fetcher';
import type { AppLog, LogLevel, LogAction } from '@/schema/AppLogSchema';

export type { AppLog, LogLevel, LogAction };

export function logToElasticsearch(log: AppLog): Promise<void> {
	const body = {
		timestamp: new Date().toISOString(),
		...log,
	};

	return post('/logs', body)
		.then(() => undefined)
		.catch((err: unknown) => {
			console.error('[logToElasticsearch] failed to index log:', err);
		});
}
