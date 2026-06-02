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

	const openOverlayStateAnimation: TargetAndTransition = { opacity: 1 };
	const closeOverlayStateAnimation: TargetAndTransition = { opacity: 0 };

	const openCardStateAnimation: TargetAndTransition = { translateY: 0, scale: 1, filter: 'blur(0px)', opacity: 1 };
	const closeCardStateAnimation: TargetAndTransition = {
		translateY: 300,
		scale: 0.9,
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
