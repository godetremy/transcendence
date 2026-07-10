export interface DatasetsAreaType {
	fill: boolean;
	label: string;
	data: number[];
	borderColor: string;
	backgroundColor: string;
}

export interface DatasetsDoughnutType {
	borderWidth: number;
	label: string;
	data: number[];
	borderColor: string[];
	backgroundColor: string[];
}

export interface OptionArea {
	labels: string[];
	datasets: DatasetsAreaType[];
}

export interface OptionDoughnut {
	labels: string[];
	datasets: DatasetsDoughnutType[];
}

export interface DashboardReturnType {
	area: {
		labels: string[];
		list: {
			label: string;
			data: number[];
		}[];
	};
	doughnut: {
		followers: {
			labels: string[];
			list: {
				label: string;
				data: number[];
			}[];
		};
		register: {
			labels: string[];
			list: {
				label: string;
				data: number[];
			}[];
		};
	};
	totalViews: number;
	totalFollowers: number;
	percentageViews: number;
	percentageFollowers: number;
}

export interface DashboardValueType {
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
