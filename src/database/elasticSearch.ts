import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { getESClient } from './prisma/elasticSearch';
import { ElasticSearchEventOrService } from '@/types/ElasticSearchType';

const getEventsOrServicesByElasticSearch = async (
	q: string,
	limit: number,
	index: string
): Promise<SearchResponse<ElasticSearchEventOrService> | null> => {
	const esclient = getESClient();
	const check = await esclient.indices.exists({ index: index });

	if (!check) return null;

	return await esclient.search<ElasticSearchEventOrService>({
		index: index,
		query: {
			bool: {
				should: [
					{
						multi_match: {
							query: q,
							fields: ['title^3', 'subtitle', 'description'],
							type: 'bool_prefix',
						},
					},
					{
						multi_match: {
							query: q,
							fields: ['title^3', 'subtitle', 'description'],
							fuzziness: q.length <= 3 ? 0 : 'AUTO',
						},
					},
				],
				minimum_should_match: 1,
			},
		},
		size: limit,
	});
};

export { getEventsOrServicesByElasticSearch };
