'use client';
import styles from './component.module.scss';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { Loader } from '@/components/globals/Loader/Loader';

export function OrganizationPicker() {
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
			<button
				onClick={() => setOpen((prev) => !prev)}
				className={`${styles.picker_button} ${open ? styles.opened : undefined}`}
			>
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
