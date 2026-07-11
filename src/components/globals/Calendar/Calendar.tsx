import styles from './component.module.scss';
import { ComponentPropsWithoutRef, JSX } from 'react';

export interface CalendarProps extends ComponentPropsWithoutRef<'div'> {
	date: Date | string;
	skeleton?: boolean;
	size?: 'small' | 'medium' | 'large' | 'xlarge';
}

export function Calendar({ date, skeleton = false, size = 'medium', ...props }: CalendarProps): JSX.Element {
	const parsedDate: Date = typeof date === 'string' ? new Date(date) : date;

	const sizeClass = styles[size];

	return (
		<span
			{...props}
			className={`${styles.calendar} ${sizeClass} ${skeleton ? styles.skeleton : ''} ${props.className ? props.className : ''}`}
		>
			{!skeleton && (
				<>
					<span className={styles.month}>{parsedDate.toLocaleDateString('fr-FR', { month: 'short' })}</span>
					<span className={styles.day}>{parsedDate.getDate()}</span>
				</>
			)}
		</span>
	);
}
