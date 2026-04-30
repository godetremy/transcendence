'use client';
import './layout.scss';
import Link from 'next/link';
import { CalendarFold, Coins, House } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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

			<main>{children}</main>
		</>
	);
}
