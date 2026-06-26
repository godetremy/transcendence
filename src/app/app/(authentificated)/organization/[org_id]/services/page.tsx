import { OrganizationDashboardHeader } from '@/components/organization/OrganizationDashboardHeader/OrganizationDashboardHeader';

export default function Page() {
	return (
		<>
			<OrganizationDashboardHeader
				title={`Services`}
				menu={[{ text: 'Tous' }, { text: 'En cours' }, { text: 'Expirée' }]}
			/>
		</>
	);
}
