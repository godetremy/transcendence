export interface DateHistogramBucket {
	key_as_string: string;
	key: number;
	doc_count: number;
	cumulative_views?: { value: number };
}

export interface ViewsOverTimeAggregations {
	views_over_time: {
		buckets: DateHistogramBucket[];
	};
}

export interface ViewDocument {
	organization_id: string;
	id: string;
	timestamp: string;
}

export interface FollowersDocument {
	organization_id: string;
	id: string;
	timestamp: string;
}
