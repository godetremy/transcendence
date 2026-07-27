import { Client } from '@elastic/elasticsearch';
import { DeleteByQueryResponse, IndexResponse } from '@elastic/elasticsearch/lib/api/types';
import { DefaultArgs, PayloadToResult, RenameAndNestPayloadKeys } from '@prisma/client/runtime/client';
import fs from 'fs';
import path from 'path';
import { $eventsPayload, $servicesPayload, $usersPayload } from './generated/models';

let esclient: Client | null = null;

const caPath = process.env.NODE_EXTRA_CA_CERTS;
let ca: Buffer | undefined;

if (caPath && fs.existsSync(caPath)) {
  ca = fs.readFileSync(caPath);
}

export function getESClient(): Client {
    if (!esclient) {
        esclient = new Client({
            node: process.env.ELASTICSEARCH_URL!,
            auth: {
                password: `${process.env.ELASTIC_PASSWORD}`,
                username: `${process.env.ELASTIC_USERNAME}`,
            },
            tls: {
                ca: ca,
                rejectUnauthorized: true,
            },
        });
    }
    return esclient;
}

const createViewElasticSearch = async (organization_id: string, id: string): Promise<IndexResponse> => {
	const esclient = getESClient();
	return esclient.index({
		index: 'views',
		document: {
			organization_id: organization_id,
			id: id,
			timestamp: new Date().toISOString(),
		},
	});
};

const createFollowersElasticSearch = async (organization_id: string): Promise<IndexResponse> => {
	const esclient = getESClient();
	return esclient.index({
		index: 'followers',
		document: {
			organization_id: organization_id,
			timestamp: new Date().toISOString(),
		},
	});
};

const deleteFollowersElasticSearch = async (organization_id: string): Promise<DeleteByQueryResponse> => {
	const esclient = getESClient();
	return esclient.deleteByQuery({
		index: 'followers',
		query: {
			term: { 'organization_id.keyword': organization_id },
		},
	});
};

const createUsersElasticSearch = async (
	result: PayloadToResult<$usersPayload<DefaultArgs>, RenameAndNestPayloadKeys<$usersPayload<DefaultArgs>>>
) => {
	const esclient = getESClient();
	if (result?.id) {
		await esclient.index({
			index: 'users',
			id: result.id,
			document: {
				full_name: result.full_name,
				mail: result.mail,
			},
		});
	}
};

const createEventElasticSearch = async (
	result: PayloadToResult<$eventsPayload<DefaultArgs>, RenameAndNestPayloadKeys<$eventsPayload<DefaultArgs>>>
) => {
	const esclient = getESClient();
	if (result?.id) {
		await esclient.index({
			index: 'events',
			id: result.id,
			document: {
				organization_id: result.organization_id,
				id: result.id,
				title: result.title,
				subtitle: result.subtitle,
				description: result.description,
			},
		});
	}
};

const createServiceElasticSearch = async (
	result: PayloadToResult<$servicesPayload<DefaultArgs>, RenameAndNestPayloadKeys<$servicesPayload<DefaultArgs>>>
) => {
	const esclient = getESClient();
	if (result?.id) {
		await esclient.index({
			index: 'services',
			id: result.id,
			document: {
				organization_id: result.organization_id,
				id: result.id,
				title: result.title,
				subtitle: result.subtitle,
				description: result.description,
			},
		});
	}
};

export {
	createViewElasticSearch,
	createFollowersElasticSearch,
	deleteFollowersElasticSearch,
	createUsersElasticSearch,
	createEventElasticSearch,
	createServiceElasticSearch,
};
