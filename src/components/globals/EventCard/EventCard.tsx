import styles from './component.module.scss';
import { ChevronRight, Clock, MapPin } from 'lucide-react';
import { Calendar } from '@/components/globals/Calendar/Calendar';
import Link from 'next/link';
import { toHumanReadablePeriod } from '@/utils/date';

export interface EventCardProps {
	id: string;
	image: string;
	start: Date;
	end: Date;
	title: string;
	location?: string;
	skeleton?: boolean;
	opacity?: number;
}

export function EventCard({ image, start, end, title, location, id, skeleton = false, opacity = 1 }: EventCardProps) {
	return (
		<Link
			href={`/app/events/${id}`}
			className={`${styles.card} ${skeleton ? styles.skeleton : ''}`}
			style={{ backgroundImage: `url(${image})`, opacity }}
		>
			<div className={styles.details}>
				<Calendar date={start} size={'medium'} skeleton={skeleton} />

				<div className={`${styles.text} ${skeleton ? styles.skeleton : ''}`}>
					<h3>{title}</h3>
					<div className={styles.tags}>
						<Clock size={16} />
						<span style={{ overflow: 'visible' }}>{toHumanReadablePeriod(start, end)}</span>
						{location && (
							<>
								<MapPin size={16} />
								<span>{location}</span>
							</>
						)}
					</div>
				</div>
				<ChevronRight />
			</div>
		</Link>
	);
}
