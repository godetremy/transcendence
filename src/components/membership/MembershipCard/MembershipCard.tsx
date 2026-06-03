import { motion, TargetAndTransition } from 'motion/react';
import styles from './component.module.scss';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';
import QRCode from 'react-qr-code';

export interface MembershipCardProps {
	requestClose: () => void;
}

export function MembershipCard(props: MembershipCardProps) {
	const user = useUser();

	const openOverlayStateAnimation: TargetAndTransition = { opacity: 1, pointerEvents: 'auto' };
	const closeOverlayStateAnimation: TargetAndTransition = { opacity: 0, pointerEvents: 'none' };

	const openCardStateAnimation: TargetAndTransition = {
		transform: 'translateY(0px) scaleX(1) scaleY(1)',
		filter: 'blur(0px)',
		opacity: 1,
		transition: {
			duration: 0.6,
			ease: [0.5, 0, 0, 1.15],
		},
	};
	const closeCardStateAnimation: TargetAndTransition = {
		transform: 'translateY(300px) scaleX(0.5) scaleY(1.2)',
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
				key={'card'}
				animate={openCardStateAnimation}
				initial={closeCardStateAnimation}
				exit={closeCardStateAnimation}
				className={styles.card}
			>
				<Image src={user?.profile_picture ?? ''} alt={user?.full_name ?? ''} width={150} height={150} />
				<h1>{user?.full_name}</h1>
				<p>Adhérent pour l&#39;année 2026-2027</p>
				<QRCode value={user?.id ?? 'INVALID'} size={240} />
			</motion.div>
		</motion.div>
	);
}
