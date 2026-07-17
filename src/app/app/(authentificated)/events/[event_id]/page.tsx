'use client';
import styles from './page.module.scss';
import { useParams } from 'next/navigation';
import { Calendar } from '@/components/globals/Calendar/Calendar';
import { CalendarPlus, Clock, MapPin, Navigation } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMediaQuery } from '@/contexts/MediaQueryProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getEventPublic, registerEventMutate } from '@/lib/fetcher/events';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import ReactMarkdown from 'react-markdown';
import { MenuButton } from '@/components/globals/MenuButton/MenuButton';
import { toHumanReadablePeriod } from '@/utils/date';
import remarkGfm from 'remark-gfm';
import { AnimatePresence } from 'motion/react';

export default function Page() {
	const { event_id }: { event_id: string } = useParams();

	const { data, isLoading, isError, error } = useQuery(getEventPublic(event_id));
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

	if (isError) return <ErrorState error={error} />;

	return (
		<div className={styles.main_container}>
			<motion.header
				style={
					!data || isLoading
						? undefined
						: {
								backgroundImage: `url('${data.image}')`,
								backgroundSize: headerBackgroundSizeTransform,
								borderBottom: headerBorderTransform,
							}
				}
				className={!data ? styles.skeleton : undefined}
			>
				<motion.div
					className={styles.details}
					style={{
						translateY: headerDetailsTranslateTransform,
						opacity: headerDetailsOpacityTransform,
						filter: headerDetailsFilterTransform,
					}}
				>
					<Calendar date={data?.start_at ?? '0'} skeleton={isLoading} />
					<div className={styles.text_container}>
						<h1 className={!data ? styles.skeleton : undefined}>
							{data?.title ?? 'Lorem ipsum dolor si amet'}
						</h1>
						<div className={`${styles.tags} ${!data ? styles.skeleton : ''}`}>
							<MenuButton
								containerKey={'event_tags'}
								menu={[{ title: 'Ajouter au calendrier', icon: CalendarPlus, onClick: () => {} }]}
							>
								<Clock size={14} />
								<span>
									{toHumanReadablePeriod(
										new Date(data?.start_at ?? '0'),
										new Date(data?.end_at ?? '0')
									)}
								</span>
							</MenuButton>
							{data && data.location && (
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
					<p>{data?.title ?? 'Loading...'}</p>
				</motion.div>
			</motion.header>
			<article>
				{(!data || data.description) && (
					<section className={`${styles.markdown} ${!data ? styles.skeleton : ''}`}>
						<ReactMarkdown remarkPlugins={[remarkGfm]}>
							{data?.description ??
								'Nisi consequat reprehenderit qui fugiat excepteur amet magna. Irure elit voluptate laboris amet ut. Veniam ut enim ea Lorem veniam consectetur irure quis commodo esse veniam id nulla culpa culpa. Ea dolore ex esse duis occaecat anim voluptate nisi elit reprehenderit cupidatat. Aliquip do labore non reprehenderit veniam dolor est magna ullamco eiusmod mollit ipsum velit. Qui mollit elit sunt. Aliqua pariatur id pariatur do.'}
						</ReactMarkdown>
					</section>
				)}
			</article>
			<footer className={styles.cta_container}>
				<AnimatePresence>
					<motion.button
						className={`${styles.cta_button} ${data?.registered ? styles.registered : ''}`}
						initial={{ scale: 0.9, opacity: 0, transition: { type: 'tween', duration: 0.2 } }}
						animate={{ scale: 1, opacity: 1, transition: { type: 'tween', duration: 0.2 } }}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.99 }}
						onClick={
							data?.registered
								? () => mutation.mutate({ register: 'true' })
								: () => mutation.mutate({ register: 'false' })
						}
					>
						{data?.registered ? 'Se désinscrire' : "S'inscrire"}
					</motion.button>
				</AnimatePresence>
			</footer>
		</div>
	);
}
