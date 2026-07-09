import styles from './component.module.scss';
import { ComponentPropsWithoutRef, JSX } from 'react';

export interface CalendarProps extends ComponentPropsWithoutRef<'div'> {
	date: number;
	skeleton?: boolean;
}

export function Calendar({ date, skeleton = false, ...props }: CalendarProps): JSX.Element {
	const parsedDate: Date = new Date(date);

	return (
		<span
			{...props}
			className={`${styles.calendar} ${skeleton ? styles.skeleton : ''} ${props.className ? props.className : ''}`}
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
