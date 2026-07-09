export interface DatasetsType {
	fill: boolean;
	label: string;
	data: number[];
	borderColor: string;
	backgroundColor: string;
}

export interface DashboardEventType {
	labels: string[];
	datasets: DatasetsType[];
}

export interface DashboardReturnType {
	area: {
		labels: string[];
		list: {
			label: string;
			data: number[];
		}[];
	};
}

export interface DashboardTabValueType {
	labels: string[];
	list: {
		label: string;
		data: number[];
	}[];
}

export interface DashboardFormatType {
	data: number[];
	labels: string[];
}
