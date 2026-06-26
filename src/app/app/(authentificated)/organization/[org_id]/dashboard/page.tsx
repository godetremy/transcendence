'use client';
import { OrganizationDashboardHeader } from '@/components/organization/OrganizationDashboardHeader/OrganizationDashboardHeader';
import { useUser } from '@/contexts/UserContext';

export default function Page() {
	const user = useUser();

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
			/>
		</>
	);
}
