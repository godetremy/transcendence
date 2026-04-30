'use client';
import { CalendarFold, Coins, House } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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

	return (
		<>
			<nav>
				{tabs.map((tab, index) => {
					const active = pathname.startsWith(tab.href);

					return (
						<Link href={tab.href} key={index} className={active ? 'active' : undefined}>
							<div className={'icon'}>
								{tab.icon === null ? (
									<Image src={'/images/demo_profile.jpg'} alt={''} width={24} height={24} />
								) : (
									<tab.icon color={active ? '#FD84FE' : '#F2F2F2'} size={24} />
								)}
							</div>
							<span>{tab.title}</span>
						</Link>
					);
				})}
			</nav>

			<div className={'overlay'} />
		</>
	);
}
