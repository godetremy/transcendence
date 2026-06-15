import { randomInt } from 'crypto';

export async function random_code() {
	const code = randomInt(0, 1000000).toString().padStart(6, randomInt(0, 10).toString());

	return code;
}
