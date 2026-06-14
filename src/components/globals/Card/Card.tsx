import { ReactNode } from 'react';
import { AnimatePresence, motion, TargetAndTransition } from 'motion/react';
import styles from './component.module.scss';

export function Card({
	visible,
	children,
	requestClose,
}: {
	visible: boolean;
	children: ReactNode;
	requestClose?: () => void;
}) {
	const openStateAnimation: TargetAndTransition = { opacity: 1, scale: 1, filter: 'blur(0px)' };
	const closeStateAnimation: TargetAndTransition = { opacity: 0, scale: 1.1, filter: 'blur(5px)' };

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					key={'modal'}
					animate={openStateAnimation}
					initial={closeStateAnimation}
					exit={closeStateAnimation}
					onClick={requestClose}
					className={styles.modalOverlay}
				>
					<div onClick={(e) => e.stopPropagation()} className={styles.modal}>
						{children}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
