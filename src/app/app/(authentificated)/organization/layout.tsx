'use client';
import styles from './layout.module.scss';
import { ReactNode, useState } from 'react';
import Image from 'next/image';
import { CalendarFold, ChevronDown, Coins, LayoutDashboard, PanelLeft, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Loader } from '@/components/globals/Loader/Loader';

function OrganizationPicker() {
	const [open, setOpen] = useState(false);
	const [loadingOrganization, setLoadingOrganization] = useState(false);

	const closedContainer = { opacity: 0, scale: 0.98, translate: '0 -5px' };
	const openedContainer = { opacity: 1, scale: 1, translate: '0 0px' };

	const selectOrganization = () => {
		setOpen(false);
		setLoadingOrganization(true);
		setTimeout(() => setLoadingOrganization(false), 2000);
	};

	return (
		<AnimatePresence>
			<button onClick={() => setOpen((prev) => !prev)} className={open ? styles.opened : undefined}>
				{loadingOrganization && <Loader size={24} dark={false} />}
				<Image src={'/images/demo_profile.jpg'} alt={'Demo organization logo'} width={24} height={24} />
				<p>Demonstration organization but with a very long title</p>
				<ChevronDown color={'currentColor'} size={16} />
			</button>

			{open && (
				<motion.div
					className={styles.picker_container}
					key="container"
					initial={closedContainer}
					animate={openedContainer}
					exit={closedContainer}
				>
					<button onClick={selectOrganization}>
						<Image src={'/images/demo_profile.jpg'} alt={'Demo organization logo'} width={28} height={28} />
						<p>Demonstration organization but with a very long title</p>
					</button>
					<button onClick={selectOrganization}>
						<Image src={'/images/demo_profile.jpg'} alt={'Demo organization logo'} width={28} height={28} />
						<p>Demonstration organization but with a very long title</p>
					</button>
					<button onClick={selectOrganization}>
						<Image src={'/images/demo_profile.jpg'} alt={'Demo organization logo'} width={28} height={28} />
						<p>Demonstration organization but with a very long title</p>
					</button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default function Layout({ children }: { children: ReactNode }) {
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
		<div className={styles.main_container}>
			<div className={`${styles.backdrop} ${!visibleSidebar ? styles.hidden : ''}`} />
			<aside className={!visibleSidebar ? styles.hidden : undefined}>
				<header>
					<OrganizationPicker />
				</header>
				{pages.map((page, i) => (
					<Link
						href={page.href}
						key={i}
						className={pathname === page.href ? styles.active : undefined}
						prefetch={true}
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
			<article className={!visibleSidebar ? styles.hidden : undefined}>{children}</article>
		</div>
	);
}
