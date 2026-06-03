import { motion, TargetAndTransition } from 'motion/react';
import styles from './component.module.scss';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';
import QRCode from 'react-qr-code';
import { useRef } from 'react';

export interface MembershipCardProps {
	requestClose: () => void;
}

export function MembershipCard(props: MembershipCardProps) {
	const user = useUser();

	const cardRef = useRef<HTMLDivElement>(null);

	const openOverlayStateAnimation: TargetAndTransition = { opacity: 1 };
	const closeOverlayStateAnimation: TargetAndTransition = { opacity: 0 };

	// translateY: 0, scale: 1,
	const openCardStateAnimation: TargetAndTransition = { filter: 'blur(0px)', opacity: 1 };
	const closeCardStateAnimation: TargetAndTransition = {
		//translateY: 300,
		//scale: 0.9,
		filter: 'blur(10px)',
		opacity: 0,
	};

	return (
		<motion.div
			key={'overlay'}
			animate={openOverlayStateAnimation}
			initial={closeOverlayStateAnimation}
			exit={closeOverlayStateAnimation}
			className={styles.overlay}
			onClick={props.requestClose}
		>
			<motion.div
				ref={cardRef}
				key={'card'}
				animate={openCardStateAnimation}
				initial={closeCardStateAnimation}
				exit={closeCardStateAnimation}
				className={styles.card}
				onMouseMove={(e) => {
					const bouding = e.currentTarget.getBoundingClientRect();

					const x = e.clientX - bouding.left;
					const y = e.clientY - bouding.top;

					const xPercentage = x / bouding.width;
					const yPercentage = y / bouding.height;

					const xRotation = (xPercentage - 0.5) * 40;
					const yRotation = (0.5 - yPercentage) * 40;

					e.currentTarget.style.setProperty('--x-rotation', `${yRotation}deg`);
					e.currentTarget.style.setProperty('--y-rotation', `${xRotation}deg`);
					e.currentTarget.style.setProperty('--x', `${xPercentage * 100}%`);
					e.currentTarget.style.setProperty('--y', `${yPercentage * 100}%`);
				}}
			>
				<Image src={user?.profile_picture ?? ''} alt={user?.full_name ?? ''} width={150} height={150} />
				<h1>{user?.full_name}</h1>
				<p>Adhérent pour l&#39;année 2026-2027</p>
				<QRCode value={user?.id ?? 'INVALID'} size={240} />
				<div className={styles.pointer_overlay} />
			</motion.div>
		</motion.div>
	);
}
