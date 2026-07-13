'use client';
import styles from './component.module.scss';
import { CalendarFold, ChevronLeft, ChevronRight, Coins, House, Wrench } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { AnimatePresence, motion, useSpring, useTransform } from 'motion/react';
import { useCallback, useEffect } from 'react';
import { Transition, Variants } from 'motion';
import { OrganizationPicker } from '@/components/organization/OrganizationSelector/OrganizationSelector';
import { useMediaQuery } from '@/contexts/MediaQueryProvider';

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

const organizationTabs = [
	{
		icon: House,
		title: 'Dashboard',
		href: 'dashboard',
	},
	{
		icon: CalendarFold,
		title: 'Événements',
		href: 'events',
	},
	{
		icon: Coins,
		title: 'Services',
		href: 'services',
	},
	{
		icon: Wrench,
		title: 'Administration',
		href: 'settings',
	},
];

const MotionLink = motion.create(Link);

export default function Sidebar() {
	const pathname = usePathname();
	const user = useUser();
	const organization = useOrganizations();

	const transition: Transition = { type: 'spring', stiffness: 300, damping: 25 };
	const showingContainer = useSpring(0, { stiffness: 400, damping: 40, duration: 0.1 });

	const openState = useSpring(0, { stiffness: 400, damping: 40, duration: 0.1 });
	const isMobile = useMediaQuery('(max-width: 768px)');

	const sidebarVariants: Variants = {
		closed: {
			width: 70,
			boxShadow: '0 0 80px rgba(0, 0, 0, 0.5)',
		},
		open: {
			width: 300,
			boxShadow: '0 0 80px rgba(0, 0, 0, 0.5)',
		},
	};

	const linkVariants = {
		closed: {
			background: 'linear-gradient(90deg, #0000 0%, #000A 70px, #000A 100%)',
		},
		open: {
			background: 'linear-gradient(90deg, #0000 0%, #0000 70px, #0000 100%)',
		},
	};

	const linkSpanVariants: Variants = {
		closed: {
			opacity: 0,
			x: -20,
			filter: 'blur(4px)',
		},
		open: {
			opacity: 1,
			x: 0,
			filter: 'blur(0px)',
		},
	};

	const toggleVariants: Variants = {
		closed: {
			opacity: 0,
			y: 20,
		},
		open: {
			opacity: 1,
			y: 0,
		},
	};

	const refreshCurrentOrganization = useCallback(() => {
		if (organization.currentOrganization) {
			showingContainer.set(1);
		} else {
			showingContainer.set(0);
		}
	}, [organization.currentOrganization, showingContainer]);

	useEffect(() => {
		refreshCurrentOrganization();
	}, [organization.currentOrganization, refreshCurrentOrganization]);

	const appTranslate = useTransform(showingContainer, [0, 1], [0, -20]);
	const appOpacity = useTransform(showingContainer, [0, 1], [1, 0]);
	const appFilter = useTransform(showingContainer, [0, 1], ['blur(0px)', 'blur(4px)']);
	const appPointerEvents = useTransform(showingContainer, [0, 1], ['auto', 'none']);
	const orgTranslate = useTransform(showingContainer, [0, 1], [20, 0]);
	const orgOpacity = useTransform(showingContainer, [0, 1], [0, 1]);
	const orgFilter = useTransform(showingContainer, [0, 1], ['blur(4px)', 'blur(0px)']);
	const orgPointerEvents = useTransform(showingContainer, [0, 1], ['none', 'auto']);

	return (
		<>
			<motion.nav
				className={styles.sidebar}
				variants={sidebarVariants}
				transition={transition}
				initial={'closed'}
				whileHover={'open'}
				onHoverStart={() => {
					openState.set(1);
				}}
				onHoverEnd={() => {
					refreshCurrentOrganization();
					openState.set(0);
				}}
			>
				<AnimatePresence>
					<motion.div
						className={styles.app_container}
						key={'app'}
						style={{
							translateX: appTranslate,
							opacity: appOpacity,
							filter: appFilter,
							pointerEvents: appPointerEvents,
						}}
					>
						{tabs.map((tab, index) => {
							const active = pathname.startsWith(tab.href);

							return (
								<MotionLink
									href={tab.href}
									key={index}
									className={`${styles.link} ${active ? styles.active : ''}`}
									variants={linkVariants}
									transition={transition}
									prefetch={true}
									scroll={false}
								>
									{active && (
										<motion.div
											className={styles.background}
											transition={transition}
											layoutId={'background'}
											layout
										/>
									)}
									<div className={styles.icon}>
										{tab.icon === null ? (
											<Image src={user?.profile_picture ?? ''} alt={''} width={24} height={24} />
										) : (
											<tab.icon color={active ? '#FD84FE' : '#F2F2F2'} size={24} />
										)}
									</div>
									<motion.span
										className={styles.title}
										variants={linkSpanVariants}
										transition={transition}
									>
										{tab.title}
									</motion.span>
								</MotionLink>
							);
						})}
						{organization.currentOrganization && (
							<motion.button
								onClick={() => showingContainer.set(1)}
								className={styles.toggle_menu_button}
								variants={toggleVariants}
								whileTap={{ scale: 0.95 }}
							>
								<ChevronRight />
								<span>Afficher l&#39;organisation</span>
							</motion.button>
						)}
					</motion.div>
					{organization.currentOrganization && (
						<motion.div
							className={styles.organization_container}
							style={{
								translateX: orgTranslate,
								opacity: orgOpacity,
								filter: orgFilter,
								pointerEvents: orgPointerEvents,
							}}
						>
							{!isMobile && <OrganizationPicker />}
							{organizationTabs.map((tab, index) => {
								const active = pathname.startsWith(
									`/app/organization/${organization.currentOrganization?.id}/${tab.href}`
								);

								return (
									<MotionLink
										href={tab.href}
										key={index}
										className={`${styles.link} ${active ? styles.active : ''}`}
										variants={linkVariants}
										transition={transition}
										prefetch={true}
										scroll={false}
									>
										{active && (
											<motion.div
												className={styles.background}
												transition={transition}
												layoutId={'background_org'}
												layout
											/>
										)}
										<div className={styles.icon}>
											{tab.icon === null ? (
												<Image
													src={user?.profile_picture ?? ''}
													alt={''}
													width={24}
													height={24}
												/>
											) : (
												<tab.icon color={active ? '#FD84FE' : '#F2F2F2'} size={24} />
											)}
										</div>
										<motion.span
											className={styles.title}
											variants={linkSpanVariants}
											transition={transition}
										>
											{tab.title}
										</motion.span>
									</MotionLink>
								);
							})}
							<motion.button
								onClick={() => showingContainer.set(0)}
								className={`${styles.toggle_menu_button} ${styles.reversed}`}
								variants={toggleVariants}
								whileTap={{ scale: 0.95 }}
							>
								<ChevronLeft />
								<span>Revenir à l&#39;application</span>
							</motion.button>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.nav>
			<motion.div
				className={styles.overlay}
				style={{
					opacity: openState,
				}}
			/>
		</>
	);
}
