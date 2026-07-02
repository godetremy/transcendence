const ES_URL = process.env.ELASTICSEARCH_URL ?? 'https://localhost:9200';
const ES_AUTH = 'Basic ' + Buffer.from(`elastic:${process.env.ELASTIC_PASSWORD ?? ''}`).toString('base64');

export type EventSearchHit = {
	id: string;
	title?: string;
	subtitle?: string;
	description?: string;
	location?: string;
	start_at?: string;
	highlight?: Record<string, string[]>;
};

type ElasticsearchSearchResponse = {
	hits: {
		hits: Array<{
			_id: string;
			_source: Record<string, unknown>;
			highlight?: Record<string, string[]>;
		}>;
	};
};

export const searchEvents = async (query: string, page = 0, size = 10): Promise<EventSearchHit[]> => {
	const must = query
		? [
				{
					bool: {
						should: [
							{
								multi_match: {
									query: query,
									fields: [
										'title^3',
										'title.fuzzy^2',
										'subtitle^2',
										'description',
										'description.fuzzy',
										'location',
									],
									fuzziness: 'AUTO',
									prefix_length: 1,
								},
							},
							{
								multi_match: {
									query: query,
									type: 'bool_prefix',
									fields: [
										'title.autocomplete',
										'title.autocomplete._2gram',
										'title.autocomplete._3gram',
										'description.autocomplete',
										'description.autocomplete._2gram',
										'description.autocomplete._3gram',
									],
								},
							},
						],
						minimum_should_match: 1,
					},
				},
			]
		: [{ match_all: {} }];

	const response = await fetch(`${ES_URL}/events/_search`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: ES_AUTH },
		body: JSON.stringify({
			from: page * size,
			size: size,
			query: {
				bool: {
					must: must,
					filter: [{ range: { start_at: { gte: 'now/d' } } }],
				},
			},
			highlight: { fields: { title: {}, description: {} } },
			sort: ['_score', { start_at: 'asc' }],
		}),
		cache: 'no-store',
	});

	if (!response.ok) {
		throw new Error(`Elasticsearch a répondu ${response.status}`);
	}

	const data = (await response.json()) as ElasticsearchSearchResponse;

	return data.hits.hits.map((hit) => ({
		id: hit._id,
		title: hit._source.title as string | undefined,
		subtitle: hit._source.subtitle as string | undefined,
		description: hit._source.description as string | undefined,
		location: hit._source.location as string | undefined,
		start_at: hit._source.start_at as string | undefined,
		highlight: hit.highlight,
	}));
};
