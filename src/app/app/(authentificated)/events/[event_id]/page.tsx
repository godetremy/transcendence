'use client';
import styles from './page.module.scss';
import { useParams } from 'next/navigation';
import { Calendar } from '@/components/globals/Calendar/Calendar';
import { CalendarPlus, Clock, MapPin, Navigation } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMediaQuery } from '@/contexts/MediaQueryProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getEventPublic, getregisterUserToEvent, registerEventMutate } from '@/lib/fetcher/events';
import { Loader } from '@/components/globals/Loader/Loader';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import ReactMarkdown from 'react-markdown';
import { MenuButton } from '@/components/globals/MenuButton/MenuButton';
import { toHumanReadablePeriod } from '@/utils/date';
import remarkGfm from 'remark-gfm';

export default function Page() {
	const { event_id }: { event_id: string } = useParams();

	const { data, isLoading, isError, error } = useQuery(getEventPublic(event_id));
	const register = useQuery(getregisterUserToEvent(event_id as string));
	const mutation = useMutation(registerEventMutate(event_id as string));

	const { scrollY } = useScroll();
	const isMobile = useMediaQuery('(max-width: 768px)');
	const headerSize = () => (isMobile ? 180 : 280);

	const headerBackgroundSizeTransform = useTransform(scrollY, [0, headerSize()], ['100%', '120%']);
	const headerBorderTransform = useTransform(
		scrollY,
		[headerSize() / 2, headerSize()],
		['1px solid #000', '1px solid #222']
	);

	const headerDetailsTranslateTransform = useTransform(scrollY, [0, headerSize() * 0.75], [0, -20]);
	const headerDetailsOpacityTransform = useTransform(scrollY, [headerSize() * 0.1, headerSize() * 0.75], [1, 0]);
	const headerDetailsFilterTransform = useTransform(
		scrollY,
		[headerSize() * 0.1, headerSize() * 0.75],
		['blur(0px)', 'blur(10px)']
	);

	const headerBarOpacityTransform = useTransform(scrollY, [headerSize() * 0.7, headerSize()], [0, 1]);
	const headerBarPointerTransform = useTransform(scrollY, [headerSize() / 2, headerSize()], ['none', 'auto']);

	if (isLoading) return <Loader />;
	if (isError || data === undefined) return <ErrorState error={error} />;

	return (
		<div className={styles.main_container}>
			<motion.header
				style={{
					backgroundImage: `url('${data.image}')`,
					backgroundSize: headerBackgroundSizeTransform,
					borderBottom: headerBorderTransform,
				}}
			>
				<motion.div
					className={styles.details}
					style={{
						translateY: headerDetailsTranslateTransform,
						opacity: headerDetailsOpacityTransform,
						filter: headerDetailsFilterTransform,
					}}
				>
					<Calendar date={data.start_at} />
					<div className={styles.text_container}>
						<h1>{data.title}</h1>
						<div className={styles.tags}>
							<MenuButton
								containerKey={'event_tags'}
								menu={[{ title: 'Ajouter au calendrier', icon: CalendarPlus, onClick: () => {} }]}
							>
								<Clock size={14} />
								<span>{toHumanReadablePeriod(new Date(data.start_at), new Date(data.end_at))}</span>
							</MenuButton>
							{data.location && (
								<MenuButton
									containerKey={'location_tags'}
									menu={[
										{
											title: 'Ouvrir dans Google Maps',
											icon: Navigation,
											onClick: () => {
												window
													.open(
														`https://www.google.com/maps/search/?api=1&query=${encodeURI(data.location ?? '')}`,
														'_blank'
													)
													?.focus();
											},
										},
									]}
									className={styles.tag}
								>
									<MapPin size={14} />
									<span>{data.location}</span>
								</MenuButton>
							)}
						</div>
					</div>
				</motion.div>
				<motion.div
					className={styles.nav}
					style={{ opacity: headerBarOpacityTransform, pointerEvents: headerBarPointerTransform }}
				>
					<p>{data.title}</p>
				</motion.div>
			</motion.header>
			<article>
				{data.description && (
					<section className={styles.markdown}>
						<ReactMarkdown remarkPlugins={[remarkGfm]}>{data.description}</ReactMarkdown>
					</section>
				)}
			</article>
			<footer className={styles.cta_container}>
				{register.data === undefined || register.isLoading ? (
					<Loader />
				) : (
					<motion.button
						className={styles.cta_button}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.99 }}
						onClick={() => {
							register.data.register == true
								? mutation.mutate({ register: 'false' })
								: mutation.mutate({ register: 'true' });
						}}
					>
						{register.data.register === true ? 'Se désinscrire' : "S'inscrire"}
					</motion.button>
				)}
			</footer>
		</div>
	);
}
