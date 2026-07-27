'use client';
import styles from './page.module.scss';
import { OrganizationDashboardHeader } from '@/components/organization/OrganizationDashboardHeader/OrganizationDashboardHeader';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { useUser } from '@/contexts/UserContext';
import { get } from '@/lib/fetcher';
import { useEffect, useState } from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	Filler,
	ArcElement,
	type ChartOptions,
	ChartData,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

import { Doughnut, Bar } from 'react-chartjs-2';
import { DashboardReturnType } from '@/types/DashBoard';
import { StatCard } from '@/components/globals/StatCard/StatCard';
import { Loader } from '@/components/globals/Loader/Loader';
import { Sparkles } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getEvents } from '@/lib/fetcher/events';
import { Calendar } from '@/components/globals/Calendar/Calendar';

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const options: ChartOptions<'bar'> = {
	responsive: true,
	maintainAspectRatio: false,
	interaction: {
		mode: 'index',
		intersect: false,
	},
	plugins: {
		legend: {
			display: false,
		},
		title: { display: false },
		tooltip: {
			backgroundColor: '#444',
			borderWidth: 1,
			borderColor: '#555',
			titleFont: { size: 14, family: 'Montserrat, sans-serif' },
			bodyFont: { size: 13, family: 'Montserrat, sans-serif' },
			padding: 15,
			cornerRadius: 10,
			displayColors: true,
			caretSize: 10,
			position: 'nearest',
			xAlign: 'center',
			yAlign: 'bottom',
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
		bar: {
			borderRadius: 10,
		},
	},
};

export default function Page() {
	const user = useUser();
	const organizationctx = useOrganizations();
	const [activeMenu, setActiveMenu] = useState<number>(0);

	const org = organizationctx.getCurrentOrganization();
	const [data, setData] = useState<DashboardReturnType>();

	const { data: events, isLoading: isLoadingEvents } = useInfiniteQuery(
		getEvents(org?.id ?? '', null, null, null, null, 1)
	);

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

	function buildViewsChart(d: DashboardReturnType) {
		return {
			labels: d.series.labels.map((label) => {
				const date = new Date(label);
				switch (activeMenu) {
					case 0:
						return DAYS[date.getDay()];
					case 1:
						return date.toLocaleDateString('fr-FR', { day: 'numeric', month: '2-digit' });
					case 2:
						return date.toLocaleDateString('fr-FR', { month: 'long' });
					default:
						return label;
				}
			}),
			datasets: [
				{
					fill: true,
					label: 'Vues',
					data: d.series.views.delta,
					backgroundColor: '#9F99FF',
				},
			],
		};
	}

	function buildFollowersDoughnut(d: DashboardReturnType): ChartData<'doughnut'> {
		const followerRate = Math.round(d.ratios.followerToViewRate * 100);
		return {
			labels: ['Followers', 'Vues'],
			datasets: [
				{
					label: 'Vues/Followers',
					data: [followerRate, 100 - followerRate],
					backgroundColor: ['#FD84FE', '#9F99FF'],
					borderWidth: 0,
				},
			],
		};
	}

	function buildRegisterDoughnut(d: DashboardReturnType): ChartData<'doughnut'> {
		const fillRate = Math.round(d.ratios.registrationFillRate * 100);
		return {
			labels: ['Inscrits', 'Places libres'],
			datasets: [
				{
					label: 'Inscrits/Places libres',
					data: [fillRate, 100 - fillRate],
					backgroundColor: ['#FD84FE', '#9F99FF'],
					borderWidth: 0,
				},
			],
		};
	}

	useEffect(() => {
		if (!org?.id) return;

		const fetchDashboard = async () => {
			try {
				const [startWeek, endWeek] = getWeek();
				const [startMonth, endMonth] = getMonth();
				const [startYear, endYear] = getYear();
				let to: Date | null = null;
				let from: Date | null = null;

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

				const response = await get<DashboardReturnType>(
					`/organization/${org!.id}/dashboard?${params.toString()}`
				);
				setData(response);
			} catch (error) {
				console.error('Erreur lors du chargement du dashboard :', error);
			}
		};

		fetchDashboard();
	}, [org?.id, activeMenu]);

	return (
		<>
			<OrganizationDashboardHeader
				title={`Salut${user?.full_name ? `, ${user.first_name ?? user.full_name}` : ''} 👋`}
				menu={[
					{ text: 'Ces 7 derniers jours' },
					{ text: 'Les 31 derniers jours' },
					{ text: 'Cette année' },
					{ text: 'Depuis le début' },
				]}
				onSelectChange={setActiveMenu}
				selected={activeMenu}
			/>
			<main className={styles.main_container}>
				<section>
					<div className={styles.main_data_container}>
						<div className={styles.views_container}>
							<h2>Nombre total de vues</h2>
							<span>Vues cumulées pour vos événements et services sur la période sélectionnée</span>
							{data ? <Bar options={options} data={buildViewsChart(data)} /> : <Loader />}
						</div>
						{data && (
							<div className={styles.stats_container}>
								<StatCard
									title="Vues"
									value={data.totals.views}
									progression={Math.round(data.growth.views.absolute)}
								/>
								<StatCard
									title="Followers"
									value={data.totals.followers}
									progression={Math.round(data.growth.followers.absolute)}
								/>
								<StatCard
									title="Inscriptions"
									value={data.totals.registrations}
									progression={Math.round(data.growth.registrations.absolute)}
								/>
								<StatCard
									title="Événements"
									value={data.totals.events_count}
									progression={Math.round(data.growth.events.absolute)}
								/>
							</div>
						)}
					</div>

					<div className={styles.side_data_container}>
						{data && (
							<div className={styles.highlights_container}>
								{data.highlights.views.peak_label && (
									<div className={styles.highlight_card}>
										<Sparkles fill={'#F2F2F2'} />
										<div>
											<strong>Bien joué !</strong>
											<p>
												Tu as obtenu {' ' + data.highlights.views.peak_value + ' '} vues le{' '}
												{new Date(data.highlights.views.peak_label).toLocaleDateString(
													'fr-FR',
													{
														day: '2-digit',
														month: 'long',
													}
												)}
											</p>
										</div>
									</div>
								)}
								{data.highlights.followers.peak_label && (
									<div className={styles.highlight_card}>
										<Sparkles fill={'#F2F2F2'} />
										<div>
											<strong>Bien joué !</strong>
											<p>
												Tu as obtenu {' ' + data.highlights.followers.peak_value + ' '} nouveaux
												followers le{' '}
												{new Date(data.highlights.followers.peak_label).toLocaleDateString(
													'fr-FR',
													{
														day: '2-digit',
														month: 'long',
													}
												)}
											</p>
										</div>
									</div>
								)}
							</div>
						)}
						<div className={styles.events_container}>
							<h2>Événements à venir</h2>
							<span>Tu as 3 événements ans les 7 prochains jours</span>
							<div>
								{isLoadingEvents && <Loader />}
								{events &&
									events.pages.map((page) =>
										page.data.map((event, i) => (
											<div key={i}>
												<Calendar date={event.start_at} />
												<div>
													<strong>{event.title}</strong>
													<span>
														{event.register_number} inscrit
														{event.register_number > 1 && 's'}
													</span>
												</div>
											</div>
										))
									)}
							</div>
						</div>
					</div>
				</section>

				<div className={styles.doughnut_container}>
					<div className={styles.doughnut_card}>
						<h3>Vues vs Followers</h3>
						<div style={{ height: 200 }}>
							{data ? (
								<Doughnut data={buildFollowersDoughnut(data)} />
							) : (
								<p>Chargement du dashboard...</p>
							)}
						</div>
					</div>
					<div className={styles.doughnut_card}>
						<h3>Taux de remplissage</h3>
						<div style={{ height: 200 }}>
							{data ? <Doughnut data={buildRegisterDoughnut(data)} /> : <p>Chargement du dashboard...</p>}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
