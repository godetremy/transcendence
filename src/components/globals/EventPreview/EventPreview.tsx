import styles from './component.module.scss';
import { ChevronRight, Clock, MapPin } from 'lucide-react';
import { ComponentPropsWithoutRef } from 'react';
import { Calendar } from '@/components/globals/Calendar/Calendar';
import Image from 'next/image';

export interface EventCardProps extends ComponentPropsWithoutRef<'button'> {
	image: string;
	date: number;
	title: string;
	time: string;
	location: string;
}

export function EventPreview({ image, date, title, time, location, ...props }: EventCardProps) {
	return (
		<button {...props} className={styles.card} style={{ backgroundImage: `url(${image})` }}>
			<div className={styles.details}>
				<Calendar date={date} />

				<div className={styles.text}>
					<h3>{title}</h3>
					<div className={styles.tags}>
						<Clock size={16} />
						<span>{time}</span>
						<MapPin size={16} />
						<span>{location}</span>
					</div>
				</div>
				<ChevronRight />
			</div>
		</button>
	);
}
