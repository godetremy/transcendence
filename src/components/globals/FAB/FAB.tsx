import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import styles from './component.module.scss';
import { AnimatePresence } from 'motion/react';

export function FAB(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
	return (
		<button className={styles.fab} {...props}>
			<AnimatePresence mode={'wait'}>{props.children}</AnimatePresence>
		</button>
	);
}
