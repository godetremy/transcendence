export interface DashboardSeriesStat {
	cumulative: number[];
	delta: number[];
}

export interface DashboardEventRow {
	id: string;
	title: string;
	start_at: string;
	registered: number;
	max_registration: number | null;
	fill_rate: number | null;
}

export interface DashboardGrowthStat {
	absolute: number;
	percent: number;
}

export interface DashboardPeakStat {
	peak_label: string | null;
	peak_value: number;
}

export interface DashboardReturnType {
	period: {
		from: string;
		to: string;
		granularity: 'day' | 'week' | 'month';
	};
	series: {
		labels: string[];
		views: DashboardSeriesStat;
		followers: DashboardSeriesStat;
		events: DashboardEventRow[];
	};
	totals: {
		views: number;
		followers: number;
		registrations: number;
		capacity: number;
		events_count: number;
	};
	growth: {
		views: DashboardGrowthStat;
		followers: DashboardGrowthStat;
		registrations: DashboardGrowthStat;
		events: DashboardGrowthStat;
	};
	highlights: {
		views: DashboardPeakStat;
		followers: DashboardPeakStat;
	};
	ratios: {
		followerToViewRate: number;
		registrationFillRate: number;
	};
}
