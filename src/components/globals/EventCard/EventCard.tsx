import styles from './component.module.scss';
import { ChevronRight, Clock, MapPin } from 'lucide-react';
import { Calendar } from '@/components/globals/Calendar/Calendar';
import Link from 'next/link';

export interface EventCardProps {
	id: string;
	image: string;
	date: Date | string;
	title: string;
	location: string;
}

export function EventCard({ image, date, title, location, id }: EventCardProps) {
	return (
		<Link href={`/app/events/${id}`} className={styles.card} style={{ backgroundImage: `url(${image})` }}>
			<div className={styles.details}>
				<Calendar date={date} size={'medium'} />

				<div className={styles.text}>
					<h3>{title}</h3>
					<div className={styles.tags}>
						<Clock size={16} />
						<span style={{ overflow: 'visible' }}>{'DEMO'}</span>
						<MapPin size={16} />
						<span>{location}</span>
					</div>
				</div>
				<ChevronRight />
			</div>
		</Link>
	);
}
