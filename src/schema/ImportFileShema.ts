import * as z from 'zod';

export const ImportFileSchema = z
	.file()
	.mime(['application/json', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);
