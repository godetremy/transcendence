import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { esclient } from './prisma/elasticSearch';
import { FollowersDocument, ViewDocument, ViewsOverTimeAggregations } from '@/types/ElasticSearch';

const getDashBoardViewsByElasticSearch = async (
	organization_id: string,
	id?: string
): Promise<SearchResponse<ViewDocument, ViewsOverTimeAggregations>> => {
	const views = await esclient.search<{ timestamp: string }>({
		index: 'views',
		size: 1,
		sort: [{ timestamp: { order: 'asc' } }],
		query: {
			bool: {
				filter: [
					{ term: { 'organization_id.keyword': organization_id } },
					...(id ? [{ term: { 'id.keyword': id } }] : []),
				],
			},
		},
	});

	const elasticSearchViews = views.hits.hits.map((hit) => ({
		update_at: hit._source?.timestamp,
	}));

	return esclient.search<ViewDocument, ViewsOverTimeAggregations>({
		index: 'views',
		size: 0,
		sort: [{ timestamp: { order: 'asc' } }],
		query: {
			bool: {
				filter: [
					{ term: { 'organization_id.keyword': organization_id } },
					...(id ? [{ term: { 'id.keyword': id } }] : []),
				],
			},
		},
		aggs: {
			views_over_time: {
				date_histogram: {
					field: 'timestamp',
					calendar_interval: 'day',
					min_doc_count: 0,
					extended_bounds: {
						min: `${elasticSearchViews[0]?.update_at}`,
						max: 'now',
					},
				},
				aggs: {
					cumulative_views: {
						cumulative_sum: {
							buckets_path: '_count',
						},
					},
				},
			},
		},
	});
};

const getDashBoardFollowersByElasticSearch = async (
	organization_id: string
): Promise<SearchResponse<FollowersDocument, ViewsOverTimeAggregations>> => {
	const followers = await esclient.search<{ timestamp: string }>({
		index: 'followers',
		size: 1,
		sort: [{ timestamp: { order: 'asc' } }],
		query: {
			bool: {
				filter: [{ term: { 'organization_id.keyword': organization_id } }],
			},
		},
	});

	const elasticSearchFollowers = followers.hits.hits.map((hit) => ({
		update_at: hit._source?.timestamp,
	}));

	return esclient.search<FollowersDocument, ViewsOverTimeAggregations>({
		index: 'followers',
		size: 0,
		sort: [{ timestamp: { order: 'asc' } }],
		query: {
			bool: {
				filter: [{ term: { 'organization_id.keyword': organization_id } }],
			},
		},
		aggs: {
			views_over_time: {
				date_histogram: {
					field: 'timestamp',
					calendar_interval: 'day',
					min_doc_count: 0,
					extended_bounds: {
						min: `${elasticSearchFollowers[0]?.update_at}`,
						max: 'now',
					},
				},
				aggs: {
					cumulative_views: {
						cumulative_sum: {
							buckets_path: '_count',
						},
					},
				},
			},
		},
	});
};

export { getDashBoardViewsByElasticSearch, getDashBoardFollowersByElasticSearch };
