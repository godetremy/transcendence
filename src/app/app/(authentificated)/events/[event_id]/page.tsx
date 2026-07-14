'use client';
import styles from './page.module.scss';
import { useParams } from 'next/navigation';
import { Calendar } from '@/components/globals/Calendar/Calendar';
import { Clock, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMediaQuery } from '@/contexts/MediaQueryProvider';

export default function Page() {
	const { event_id } = useParams();

	const isMobile = useMediaQuery('(max-width: 768px)');
	const headerSize = () => (isMobile ? 180 : 280);
	const { scrollY } = useScroll();

	return (
		<div className={styles.main_container}>
			<motion.header
				style={{
					backgroundImage: `url('/images/demo_event_01.png')`,
					backgroundSize: useTransform(scrollY, [0, headerSize()], ['100%', '120%']),
					borderBottom: useTransform(
						scrollY,
						[headerSize() / 2, headerSize()],
						['1px solid #000', '1px solid #222']
					),
				}}
			>
				<motion.div
					className={styles.details}
					style={{
						translateY: useTransform(scrollY, [0, headerSize() * 0.75], [0, -20]),
						opacity: useTransform(scrollY, [headerSize() * 0.1, headerSize() * 0.75], [1, 0]),
						filter: useTransform(
							scrollY,
							[headerSize() * 0.1, headerSize() * 0.75],
							['blur(0px)', 'blur(10px)']
						),
					}}
				>
					<Calendar date={new Date()} />
					<div className={styles.text_container}>
						<h1>Titre de l&#39;évent</h1>
						<div className={styles.tags}>
							<button>
								<Clock size={14} />
								<span>Lundi de 18h à 20h</span>
							</button>
							<button>
								<MapPin size={14} />
								<span>Amphithéàtre</span>
							</button>
						</div>
					</div>
				</motion.div>
				<motion.div
					className={styles.nav}
					style={{
						opacity: useTransform(scrollY, [headerSize() * 0.7, headerSize()], [0, 1]),
						pointerEvents: useTransform(scrollY, [headerSize() / 2, headerSize()], ['none', 'auto']),
					}}
				>
					<p>Titre de l&#39;évent</p>
				</motion.div>
			</motion.header>
			<article>
				<section>
					<p>Description de taille par défaut</p>
				</section>
				<div style={{ height: 10000 }} />
			</article>
			<footer className={styles.cta_container}>
				<motion.button className={styles.cta_button} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }}>
					S&#39;inscrire
				</motion.button>
			</footer>
		</div>
	);
}
