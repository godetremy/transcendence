import { OrganizationDashboardHeader } from '@/components/organization/OrganizationDashboardHeader/OrganizationDashboardHeader';

export default function Page() {
	return (
		<>
			<OrganizationDashboardHeader
				title={`Events`}
				menu={[{ text: 'À venir' }, { text: 'Dans la semaine' }, { text: 'Passée' }]}
			/>
		</>
	);
}
