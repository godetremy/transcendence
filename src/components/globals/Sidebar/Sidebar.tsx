'use client';
import styles from './component.module.scss';
import { CalendarFold, Coins, House } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';

const tabs = [
	{
		icon: House,
		title: 'Accueil',
		href: '/app/home',
	},
	{
		icon: CalendarFold,
		title: 'Events',
		href: '/app/events',
	},
	{
		icon: Coins,
		title: 'Services',
		href: '/app/services',
	},
	{
		icon: null,
		title: 'Toi',
		href: '/app/me',
	},
];

export default function Sidebar() {
	const pathname = usePathname();
	const user = useUser();

	return (
		<>
			<nav className={styles.sidebar}>
				{tabs.map((tab, index) => {
					const active = pathname.startsWith(tab.href);

					return (
						<Link
							href={tab.href}
							key={index}
							className={`${styles.link} ${active ? styles.active : ''}`}
							prefetch={true}
							scroll={false}
						>
							<div className={styles.icon}>
								{tab.icon === null ? (
									<Image src={user?.profile_picture ?? ''} alt={''} width={24} height={24} />
								) : (
									<tab.icon color={active ? '#FD84FE' : '#F2F2F2'} size={24} />
								)}
							</div>
							<span className={styles.title}>{tab.title}</span>
						</Link>
					);
				})}
			</nav>

			<div className={styles.overlay} />
		</>
	);
}
