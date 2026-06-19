'use client';
import styles from './layout.module.scss';
import { ReactNode, useState } from 'react';
import { CalendarFold, Coins, LayoutDashboard, Wrench } from 'lucide-react';
import { useParams } from 'next/navigation';
import { OrganizationSidebar } from '@/components/organization/OrganizationSidebar/OrganizationSidebar';

export default function Layout({ children }: { children: ReactNode }) {
	const { org_id } = useParams();
	const [visibleSidebar, setVisibleSidebar] = useState(false);

	const pages = [
		{
			icon: LayoutDashboard,
			name: 'Dashboard',
			href: `/app/organization/${org_id}/dashboard`,
		},
		{
			icon: CalendarFold,
			name: `Événement`,
			href: `/app/organization/${org_id}/events`,
		},
		{
			icon: Coins,
			name: 'Services',
			href: `/app/organization/${org_id}/services`,
		},
		{
			icon: Wrench,
			name: 'Paramètre',
			href: `/app/organization/${org_id}/settings`,
		},
	];

	return (
		<div className={styles.main_container}>
			<OrganizationSidebar pages={pages} setVisibleSidebar={setVisibleSidebar} visibleSidebar={visibleSidebar} />
			<article className={!visibleSidebar ? styles.hidden : undefined}>{children}</article>
		</div>
	);
}
