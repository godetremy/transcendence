'use client';
import styles from './components.module.scss';
import { CalendarFold, Coins, LayoutDashboard, PanelLeft, Wrench } from 'lucide-react';
import { OrganizationPicker } from '@/components/organization/OrganizationSelector/OrganizationSelector';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';

export interface OrganizationSidebarProps {
	children: ReactNode;
}

export function OrganizationSidebar(props: OrganizationSidebarProps) {
	const { org_id } = useParams();
	const pathname = usePathname();
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
		<>
			<div className={`${styles.backdrop} ${!visibleSidebar ? styles.hidden : ''}`} />
			<aside className={`${styles.sidebar} ${!visibleSidebar ? styles.hidden : undefined}`}>
				<header>
					<OrganizationPicker />
				</header>
				{pages.map((page, i) => (
					<Link
						href={page.href}
						key={i}
						className={pathname.startsWith(page.href) ? styles.active : undefined}
						prefetch={true}
						onNavigate={() => setVisibleSidebar(false)}
					>
						<page.icon size={20} />
						{page.name}
					</Link>
				))}
			</aside>
			<button
				onClick={() => setVisibleSidebar(!visibleSidebar)}
				className={`${styles.sidebar_button} ${!visibleSidebar ? styles.hidden : ''}`}
			>
				<PanelLeft color={'currentColor'} />
			</button>
			<article className={!visibleSidebar ? styles.hidden : undefined}>{props.children}</article>
		</>
	);
}
