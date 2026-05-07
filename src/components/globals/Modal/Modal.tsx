import styles from './component.module.scss';
import { ModalOptions } from '@/components/globals/ModalProvider/ModalProvider';
import { motion, TargetAndTransition } from 'motion/react';

export interface ModalProps extends ModalOptions {
	close: () => void;
}

export function Modal(modal: ModalProps) {
	const openStateAnimation: TargetAndTransition = { opacity: 1, scale: 1, filter: 'blur(0px)' };
	const closeStateAnimation: TargetAndTransition = { opacity: 0, scale: 1.1, filter: 'blur(5px)' };

	return (
		<motion.div
			key={'modal'}
			animate={openStateAnimation}
			initial={closeStateAnimation}
			exit={closeStateAnimation}
			onClick={(modal?.canClose ?? true) ? modal.close : undefined}
			className={styles.modalOverlay}
		>
			<div onClick={(e) => e.stopPropagation()} className={styles.modal}>
				<h3>{modal?.title}</h3>
				{modal?.message && <p>{modal.message}</p>}

				<div className={styles.buttons}>
					{modal?.buttons?.map((button, index) => (
						<button className={button.negative ? styles.negative : ''} onClick={button.onClick} key={index}>
							{button.text}
						</button>
					))}
				</div>
			</div>
		</motion.div>
	);
}
