'use client';
import styles from './page.module.scss';
import { EventCard } from '@/components/globals/EventCard/EventCard';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function Page() {
	const [selectedTag, setSelectedTag] = useState(0);

	return (
		<div className={styles.page}>
			<header>
				<section className={styles.tags_container}>
					<label>
						<input
							type={'radio'}
							value={0}
							checked={selectedTag === 0}
							onChange={() => setSelectedTag(0)}
						/>
						Tous
					</label>
					<label>
						<input
							type={'radio'}
							value={1}
							checked={selectedTag === 1}
							onChange={() => setSelectedTag(1)}
						/>
						Inscrit
					</label>
					<label>
						<input
							type={'radio'}
							value={2}
							checked={selectedTag === 2}
							onChange={() => setSelectedTag(2)}
						/>
						Par les clubs
					</label>
					<label>
						<input
							type={'radio'}
							value={3}
							checked={selectedTag === 3}
							onChange={() => setSelectedTag(3)}
						/>
						Passée
					</label>
				</section>
				<section className={styles.search_container}>
					<button className={styles.buttonSearch}>
						<Search size={18} />
					</button>
				</section>
			</header>
			<main>
				<span>Aujourd&#39;hui</span>
				<EventCard
					id={'blablabla'}
					image={'/images/demo_event_01.png'}
					date={new Date()}
					title={'🎙️ Soirée Karaoké'}
					location={'Terrasse'}
				/>
				<EventCard
					id={'blablabla'}
					image={'/images/demo_event_01.png'}
					date={new Date()}
					title={'🎙️ Soirée Karaoké'}
					location={'Terrasse'}
				/>
				<span>Demain</span>
				<EventCard
					id={'blablabla'}
					image={'/images/demo_event_01.png'}
					date={new Date()}
					title={'🎙️ Soirée Karaoké'}
					location={'Terrasse'}
				/>
			</main>
		</div>
	);
}
