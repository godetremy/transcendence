'use client';
import styles from './page.module.scss';
import { useParams } from 'next/navigation';
import { Calendar } from '@/components/globals/Calendar/Calendar';
import { Clock, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMediaQuery } from '@/contexts/MediaQueryProvider';
import { useQuery } from '@tanstack/react-query';
import { getEventPublic } from '@/lib/fetcher/events';
import { Loader } from '@/components/globals/Loader/Loader';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import { getDay, getHours } from 'date-fns';

const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function Page() {
	const { event_id } = useParams();

	const { data, isLoading, isError, error } = useQuery(getEventPublic(event_id as string));
	const isMobile = useMediaQuery('(max-width: 768px)');
	const headerSize = () => (isMobile ? 180 : 280);
	const { scrollY } = useScroll();

	const backgroundSize = useTransform(scrollY, [0, headerSize()], ['100%', '120%']);
	const borderBottom = useTransform(scrollY, [headerSize() / 2, headerSize()], ['1px solid #000', '1px solid #222']);

	const translateY = useTransform(scrollY, [0, headerSize() * 0.75], [0, -20]);
	const opacity = useTransform(scrollY, [headerSize() * 0.1, headerSize() * 0.75], [1, 0]);
	const filter = useTransform(scrollY, [headerSize() * 0.1, headerSize() * 0.75], ['blur(0px)', 'blur(10px)']);

	const opacityNav = useTransform(scrollY, [headerSize() * 0.7, headerSize()], [0, 1]);
	const pointerEvents = useTransform(scrollY, [headerSize() / 2, headerSize()], ['none', 'auto']);

	const formatTime = (first: Date, second: Date) => {
		const day = getDay(first);
		if (day == getDay(second)) return `${days[day]} de ${getHours(first)}h à ${getHours(second)}h`;
		return `${days[day]} à ${getHours(first)}h au ${days[getDay(second)]} à ${getHours(second)}h`;
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : isError || data === undefined ? (
				<ErrorState error={error} />
			) : (
				<div className={styles.main_container}>
					<motion.header
						style={{
							backgroundImage: `url('/images/demo_event_01.png')`,
							backgroundSize: backgroundSize,
							borderBottom: borderBottom,
						}}
					>
						<motion.div
							className={styles.details}
							style={{
								translateY: translateY,
								opacity: opacity,
								filter: filter,
							}}
						>
							<Calendar date={data.start_at} />
							<div className={styles.text_container}>
								<h1>{data.title}</h1>
								<div className={styles.tags}>
									<button>
										<Clock size={14} />
										<span>{formatTime(new Date(data.start_at), new Date(data.end_at))}</span>
									</button>
									<button>
										<MapPin size={14} />
										<span>{data.location}</span>
									</button>
								</div>
							</div>
						</motion.div>
						<motion.div
							className={styles.nav}
							style={{
								opacity: opacityNav,
								pointerEvents: pointerEvents,
							}}
						>
							<p>{data.title}</p>
						</motion.div>
					</motion.header>
					<article>
						<section>
							<p>{data.description}</p>
						</section>
						<div style={{ height: 10000 }} />
					</article>
					<footer className={styles.cta_container}>
						<motion.button
							className={styles.cta_button}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.99 }}
						>
							S&#39;inscrire
						</motion.button>
					</footer>
				</div>
			)}
		</>
	);
}
