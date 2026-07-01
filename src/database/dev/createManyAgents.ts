import { createAgentsUser } from '@/database/User';

const accountsToCreate = 100;
const now = Date.now();

(async () => {
	for (let i = 0; i < accountsToCreate; i++) {
		await createAgentsUser(`agentsuser${now}${i}@demo.com`, 'test.123', false, true);
		console.log(
			`Created agents (${i + 1} / ${accountsToCreate}) (${Math.round(((i + 1) / accountsToCreate) * 100)}%)`
		);
	}
	process.exit();
})();
