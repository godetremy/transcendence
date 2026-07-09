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
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

import { Line } from 'react-chartjs-2';
import { DashboardEventType, DashboardReturnType, DashboardTabValueType } from '@/types/DashBoard';

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

	const [dashboard, setDashboard] = useState<DashboardEventType>();

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

	const color = ['rgb(159, 153, 255)', 'rgb(153, 255, 186)', 'rgb(253, 132, 254)'];

	function formatGraph(data: DashboardTabValueType): DashboardEventType {
		return {
			labels: data.labels,
			datasets: data.list.map((row, i) => {
				return {
					fill: true,
					label: row.label,
					data: row.data,
					borderColor: color[i % 3],
					backgroundColor: color[i % 3],
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
				setDashboard(formatGraph(data.area));
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
			<div style={{ height: 500 }}>
				{dashboard ? <Line options={options} data={dashboard} /> : <p>Chargement du dashboard...</p>}
			</div>
		</>
	);
}
