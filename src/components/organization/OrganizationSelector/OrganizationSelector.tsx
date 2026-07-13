'use client';
import styles from './component.module.scss';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { Loader } from '@/components/globals/Loader/Loader';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export function OrganizationPicker() {
	const organizationCtx = useOrganizations();

	const [open, setOpen] = useState(false);
	const [loadingOrganization] = useState(false);

	const closedContainer = { opacity: 0, scale: 0.98, translate: '0 -5px' };
	const openedContainer = { opacity: 1, scale: 1, translate: '0 0px' };

	const currentOrganization = organizationCtx.getCurrentOrganization();

	if (!currentOrganization) redirect('/app/home');

	return (
		<AnimatePresence>
			<button
				onClick={() => setOpen((prev) => !prev)}
				className={`${styles.picker_button} ${open ? styles.opened : undefined}`}
			>
				{loadingOrganization && <Loader size={24} dark={false} />}
				<Image src={currentOrganization.logo} alt={`${currentOrganization.name} logo`} width={30} height={30} />
				<p>{currentOrganization.name}</p>
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
					{organizationCtx.organizations.map((organization, i) => (
						<Link
							key={i}
							href={`/app/organization/${organization.id}/dashboard`}
							onNavigate={() => setOpen(false)}
						>
							<Image src={organization.logo} alt={`${organization.name} logo`} width={28} height={28} />
							<p>{organization.name}</p>
						</Link>
					))}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
