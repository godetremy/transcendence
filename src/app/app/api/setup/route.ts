import { NextResponse } from 'next/server';
import { existsSync, writeFileSync } from 'node:fs';
import { errorHandler } from '@/utils/errors';
import path from 'path';

export const PUT = () => {
	return errorHandler(async () => {
		const uri = path.resolve(process.cwd(), '.init_done');
		if (!existsSync(uri)) writeFileSync(uri, 'ok', 'utf-8');
		return NextResponse.json({ success: true });
	});
};
