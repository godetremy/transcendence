import styles from './components.module.scss';
import { Calendar } from '@/components/globals/Calendar/Calendar';
import { ChevronRight } from 'lucide-react';
import { ComponentPropsWithoutRef, JSX, forwardRef, HTMLAttributes } from 'react';

export interface EventItemProps extends ComponentPropsWithoutRef<'button'> {
	date: number;
	title: string;
	description: string;
	skeleton?: boolean;
	skeletonDelay?: number;
}

export function EventItem({
	date,
	title,
	description,
	skeleton = false,
	skeletonDelay = 0,
	...props
}: EventItemProps): JSX.Element {
	return (
		<button
			{...props}
			className={`${styles.eventItem} ${skeleton ? styles.skeleton : ''} ${props.className ? props.className : ''}`}
			style={{ animationDelay: `${skeletonDelay}s` }}
		>
			<Calendar date={date} skeleton={skeleton} />

			<div>
				<h3>{title}</h3>
				<p>{description}</p>
			</div>

			<ChevronRight color={'currentColor'} size={28} />
		</button>
	);
}

export const EventItemSkeletons = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
	return (
		<div className={styles.eventSkeletonContainer} {...props} ref={ref}>
			{[0, 1, 2].map((index) => (
				<EventItem
					skeleton={true}
					title={''}
					description={''}
					date={0}
					key={index}
					skeletonDelay={index * 0.1}
				/>
			))}
		</div>
	);
});
EventItemSkeletons.displayName = 'EventItemSkeletons';
