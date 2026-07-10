'use client';
import { OrganizationDashboardHeader } from '@/components/organization/OrganizationDashboardHeader/OrganizationDashboardHeader';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { useUser } from '@/contexts/UserContext';
import { get } from '@/lib/fetcher';
import { PrivateOrganization } from '@/types/Organization';
import { useEffect, useState } from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
	ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

import { Doughnut, Line } from 'react-chartjs-2';
import { DashboardReturnType, DashboardValueType, OptionArea, OptionDoughnut } from '@/types/DashBoard';

export const options = {
	responsive: true,
	maintainAspectRatio: false,
	interaction: {
		mode: 'index' as const,
		intersect: false,
	},
	plugins: {
		legend: {
			position: 'top' as const,
			labels: {
				usePointStyle: true,
				padding: 20,
				font: { size: 12, family: "'Inter', sans-serif" },
			},
		},
		title: {
			display: true,
			text: 'Statistiques des événements',
			font: { size: 18, weight: 'bold' as const },
			padding: { top: 10, bottom: 20 },
		},
		tooltip: {
			backgroundColor: 'rgba(0,0,0,0.8)',
			titleFont: { size: 14 },
			bodyFont: { size: 13 },
			padding: 12,
			cornerRadius: 8,
			displayColors: true,
		},
	},
	elements: {
		line: {
			tension: 0.4,
		},
		point: {
			radius: 4,
			hoverRadius: 6,
		},
	},
};

export default function Page() {
	const user = useUser();
	const organizationctx = useOrganizations();
	const [activeMenu, setActiveMenu] = useState<number>(0);
	const [org] = useState<PrivateOrganization>(organizationctx.getCurrentOrganization()!);

	const [dashboardArea, setDashboardArea] = useState<OptionArea>();
	const [dashboardDoughnutFollowers, setDashboardDoughnutFollowers] = useState<OptionDoughnut>();
	const [dashboardDoughnutRegister, setDashboardDoughnutRegister] = useState<OptionDoughnut>();
	const [data, setData] = useState<DashboardReturnType>();

	function addDays(date: Date, days: number): Date {
		const result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}

	function getWeek() {
		const today = new Date();
		return [addDays(today, -7), today];
	}

	function getMonth() {
		const today = new Date();
		return [addDays(today, -30), today];
	}

	function getYear() {
		const today = new Date();
		return [addDays(today, -365), today];
	}

	const colorBackground = ['rgb(159, 153, 255)', 'rgb(153, 255, 186)', 'rgb(253, 132, 254)'];
	const color = ['rgb(86, 79, 175)', 'rgb(75, 167, 104)', 'rgb(160, 56, 160)'];

	function formatOptionArea(data: DashboardValueType): OptionArea {
		return {
			labels: data.labels,
			datasets: data.list.map((row, i) => {
				return {
					fill: true,
					label: row.label,
					data: row.data,
					borderColor: color[i % 3],
					backgroundColor: colorBackground[i % 3],
				};
			}),
		};
	}

	function formatOptionDoughnut(data: DashboardValueType): OptionDoughnut {
		return {
			labels: data.labels,
			datasets: data.list.map((row) => {
				return {
					label: row.label,
					data: row.data,
					borderColor: data.labels.map((row, i) => color[i % 3]),
					backgroundColor: data.labels.map((row, i) => colorBackground[i % 3]),
					borderWidth: 3,
				};
			}),
		};
	}

	useEffect(() => {
		const fetchDashboard = async () => {
			try {
				const [startWeek, endWeek] = getWeek();
				const [startMonth, endMonth] = getMonth();
				const [startYear, endYear] = getYear();
				let to = null;
				let from = null;

				if (activeMenu == 0) {
					from = startWeek;
					to = endWeek;
				} else if (activeMenu == 1) {
					from = startMonth;
					to = endMonth;
				} else if (activeMenu == 2) {
					from = startYear;
					to = endYear;
				}

				const params = new URLSearchParams({
					...(from == null ? {} : { from: from.toISOString() }),
					...(to == null ? {} : { to: to.toISOString() }),
				});

				const data = await get<DashboardReturnType>(`/organization/${org.id}/dashboard?${params.toString()}`);
				setDashboardArea(formatOptionArea(data.area));
				setDashboardDoughnutFollowers(formatOptionDoughnut(data.doughnut.followers));
				setDashboardDoughnutRegister(formatOptionDoughnut(data.doughnut.register));
				setData(data);
			} catch (error) {
				console.error('Erreur lors du chargement du dashboard :', error);
			}
		};

		fetchDashboard();
	}, [org.id, activeMenu]);

	return (
		<>
			<OrganizationDashboardHeader
				title={`Salut${user?.full_name ? `, ${user.first_name ?? user.full_name}` : ''} 👋`}
				menu={[
					{ text: 'Cette semaine' },
					{ text: 'Ce mois ci' },
					{ text: 'Cette année' },
					{ text: 'Tout le temps' },
				]}
				onSelectChange={setActiveMenu}
				selected={activeMenu}
			/>
			{data != null ? (
				<>
					<h1>
						Views : {data.totalViews} {data.percentageViews.toPrecision(3)}%
					</h1>
					<h1>
						Followers : {data.totalFollowers} {data.percentageFollowers.toPrecision(3)}%
					</h1>
				</>
			) : null}
			<div style={{ height: 500 }}>
				{dashboardArea ? <Line options={options} data={dashboardArea} /> : <p>Chargement du dashboard...</p>}
			</div>
			<div style={{ height: 200 }}>
				{dashboardDoughnutFollowers ? (
					<Doughnut data={dashboardDoughnutFollowers} />
				) : (
					<p>Chargement du dashboard...</p>
				)}
			</div>
			<div style={{ height: 200 }}>
				{dashboardDoughnutRegister ? (
					<Doughnut data={dashboardDoughnutRegister} />
				) : (
					<p>Chargement du dashboard...</p>
				)}
			</div>
		</>
	);
}
