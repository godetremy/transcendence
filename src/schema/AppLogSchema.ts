import { z } from 'zod';

export const LogLevel = z.enum(['SUCCESS', 'INFO', 'WARNING', 'ERROR']);
export type LogLevel = z.infer<typeof LogLevel>;

export const LogAction = z.enum(['EVENT_CREATED', 'EVENT_UPDATED', 'EVENT_DELETED', 'USER_LOGIN', 'USER_LOGOUT']);
export type LogAction = z.infer<typeof LogAction>;

export const AppLogSchema = z.object({
	timestamp: z.string().datetime().optional(),
	level: LogLevel.default('INFO'),
	action: LogAction,
	message: z.string().max(512),
	source: z.string().max(128),
	metadata: z.record(z.string(), z.unknown()).default({}),
});

export type AppLog = z.infer<typeof AppLogSchema>;
