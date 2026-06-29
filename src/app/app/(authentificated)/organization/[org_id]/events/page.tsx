import { OrganizationDashboardTable } from '@/components/organization/OrganizationDashboardTable/OrganizationDashboardTable';

export default function Page() {
	return (
		<>
			<OrganizationDashboardTable
				header={{
					title: `Events`,
					menu: [{ text: 'À venir' }, { text: 'Dans la semaine' }, { text: 'Passée' }],
				}}
				column={[
					{ text: 'Date', width: 70 },
					{ text: 'Nom de l’événement' },
					{ text: 'Crée le', width: 80 },
					{ text: 'Crée par', width: 200 },
					{ text: 'Inscrits', width: 100 },
					{ text: '', width: 50 },
				]}
				data={[
					...Array.from({ length: 100 }, () => [
						<p key={1}>Demo</p>,
						<p key={2}>Demo</p>,
						<p key={3}>Demo</p>,
						<p key={4}>Demo</p>,
						<p key={5}>Demo</p>,
						<p key={6}>Demo</p>,
					]),
				]}
			/>
		</>
	);
}
