import styles from './component.module.scss';
import { Clock, MapPin } from 'lucide-react';
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
		<button {...props} className={styles.card}>
			<Image src={image} alt={title} fill className={styles.image} />
			<div className={styles.overlay} />
			<div className={styles.calendar}>
				<Calendar date={date} />
			</div>
			<h1 className={styles.h1}>{title}</h1>
			<p className={styles.p}>
				<Clock size={16} />
				{time}
				<MapPin size={16} />
				{location}
			</p>
		</button>
	);
}
