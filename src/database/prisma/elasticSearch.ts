import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import path from 'path';

export const esclient = new Client({
	node: process.env.ELASTICSEARCH_URL,
	auth: {
		password: `${process.env.ELASTIC_PASSWORD}`,
		username: `${process.env.ELASTIC_USERNAME}`,
	},
	tls: {
		ca: fs.readFileSync(path.join(process.cwd(), 'docker/services/elasticsearch/certs/ca/ca.crt')),
		rejectUnauthorized: true,
	},
});
