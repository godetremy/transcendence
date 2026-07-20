'use client';
import { ShowMoreButton } from '@/components/globals/ShowMoreButton/ShowMoreButton';
import styles from './page.module.scss';
import { EventCard } from '@/components/globals/EventCard/EventCard';
import { getEventsPublic } from '@/lib/fetcher/events';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Fragment, useState } from 'react';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import { AnimatePresence, motion } from 'motion/react';
import { Transition } from 'motion';

export default function Page() {
	const [selectedTag, setSelectedTag] = useState(0);
	const [search, setSearch] = useState<string>('');
	const [showSearch, setShowSearch] = useState(false);

	const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useInfiniteQuery(
		getEventsPublic(null, selectedTag == 2 ? null : new Date().toISOString(), search, selectedTag)
	);

	const searchTransition: Transition = { type: 'spring', stiffness: 400, damping: 40 };

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
					<AnimatePresence mode={'wait'}>
						{showSearch ? (
							<motion.div
								className={styles.inputContainerSearch}
								initial={{ width: 35, transition: searchTransition }}
								animate={{ width: '100%', transition: searchTransition }}
								exit={{ width: 35, transition: searchTransition }}
								key={'input'}
							>
								<Search size={16} />
								<input
									type={'text'}
									autoFocus
									placeholder={'Chercher un événements...'}
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									onBlur={() => {
										if (search.trim().length === 0) {
											setShowSearch(false);
											setSearch('');
										}
									}}
									onKeyUp={(e) => {
										if (e.key === 'Escape') {
											e.currentTarget.blur();
											setShowSearch(false);
											setSearch('');
										}
									}}
								/>
							</motion.div>
						) : (
							<motion.button
								key={'button'}
								className={styles.buttonSearch}
								whileTap={{ scale: 0.95 }}
								onClick={() => setShowSearch(true)}
							>
								<Search size={16} />
							</motion.button>
						)}
					</AnimatePresence>
				</section>
			</header>
			<main>
				{isLoading ? (
					<>
						<span className={styles.skeleton}>Loading...</span>
						{['Consectetur enim ullamco', 'eu duis consectetur', 'sint officia qui sint'].map(
							(title, index) => (
								<EventCard
									key={index}
									id={index.toString()}
									image={''}
									start={new Date('0')}
									end={new Date('0')}
									title={title}
									skeleton={true}
									opacity={0.5 - (0.2 / 3) * index}
								/>
							)
						)}
					</>
				) : isError || data === undefined ? (
					<ErrorState error={error} />
				) : (
					data.pages.map((row) =>
						row.data.map((event, index) =>
								<Fragment key={index}>
										<EventCard
											key={event.id}
											id={event.id}
											image={
												event.image && event.image !== 'null'
													? event.image
													: '/images/demo_event_01.png'
											}
											start={new Date(event.start_at)}
											end={new Date(event.end_at)}
											title={event.title}
											location={event.location ?? 'aucun lieu'}
										/>
								</Fragment>
						)
					)
				)}
				{hasNextPage && !isLoading && (
					<ShowMoreButton
						onClick={() => fetchNextPage?.()}
						className={styles.next_page_button}
						loading={isFetchingNextPage}
					/>
				)}
			</main>
		</div>
	);
}
