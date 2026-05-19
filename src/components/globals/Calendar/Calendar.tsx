import styles from './components.module.scss';
import { ComponentPropsWithoutRef, JSX } from 'react';

export interface CalendarProps extends ComponentPropsWithoutRef<'div'> {
	date: number;
}

export function Calendar({ date, ...props }: CalendarProps): JSX.Element {
	const parsedDate: Date = new Date(date);

	return (
		<span {...props} className={`${styles.calendar} ${props.className ? props.className : ''}`}>
			<span className={styles.month}>{parsedDate.toLocaleDateString('fr-FR', { month: 'short' })}</span>
			<span className={styles.day}>{parsedDate.getDate()}</span>
		</span>
	);
}