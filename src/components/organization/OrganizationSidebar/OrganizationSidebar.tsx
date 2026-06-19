import styles from './components.module.scss';
import { LucideProps, PanelLeft } from 'lucide-react';
import { OrganizationPicker } from '@/components/organization/OrganizationSelector/OrganizationSelector';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export interface OrganizationSidebarProps {
	visibleSidebar: boolean;
	setVisibleSidebar: (val: boolean) => void;
	pages: {
		icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
		name: string;
		href: string;
	}[];
}

export function OrganizationSidebar(props: OrganizationSidebarProps) {
	const pathname = usePathname();

	return (
		<>
			<div className={`${styles.backdrop} ${!props.visibleSidebar ? styles.hidden : ''}`} />
			<aside className={`${styles.sidebar} ${!props.visibleSidebar ? styles.hidden : undefined}`}>
				<header>
					<OrganizationPicker />
				</header>
				{props.pages.map((page, i) => (
					<Link
						href={page.href}
						key={i}
						className={pathname === page.href ? styles.active : undefined}
						prefetch={true}
						onNavigate={() => props.setVisibleSidebar(false)}
					>
						<page.icon size={20} />
						{page.name}
					</Link>
				))}
			</aside>
			<button
				onClick={() => props.setVisibleSidebar(!props.visibleSidebar)}
				className={`${styles.sidebar_button} ${!props.visibleSidebar ? styles.hidden : ''}`}
			>
				<PanelLeft color={'currentColor'} />
			</button>
		</>
	);
}
