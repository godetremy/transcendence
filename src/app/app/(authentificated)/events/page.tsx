'use client';
import { ShowMoreButton } from '@/components/globals/ShowMoreButton/ShowMoreButton';
import styles from './page.module.scss';
import { EventCard } from '@/components/globals/EventCard/EventCard';
import { getEventsPublic } from '@/lib/fetcher/events';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Loader } from '@/components/globals/Loader/Loader';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';

export default function Page() {
	const [selectedTag, setSelectedTag] = useState(0);
	const [search, setSearch] = useState<string>('');

	const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useInfiniteQuery(
		getEventsPublic(null, selectedTag == 2 ? null : new Date().toISOString(), search, selectedTag)
	);

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
				{isLoading ? (
					<Loader />
				) : isError || data === undefined ? (
					<ErrorState error={error} />
				) : (
					data.pages.map((row) =>
						row.data.map((category) =>
							category.data.length === 0 ? null : (
								<div key={category.name} className={styles.category}>
									<span>{category.name}</span>
									{category.data.map((event) => (
										<EventCard
											key={event.id}
											id={event.id}
											image={
												event.image && event.image !== 'null'
													? event.image
													: '/images/demo_event_01.png'
											}
											date={event.start_at}
											title={event.title}
											location={event.location ?? 'aucun lieu'}
										/>
									))}
								</div>
							)
						)
					)
				)}
				{hasNextPage && !isLoading && (
					<ShowMoreButton onClick={() => fetchNextPage?.()} className={styles.next_page_button} />
				)}
			</main>
		</div>
	);
}
