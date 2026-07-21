'use client';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import { Check, X } from 'lucide-react';
import { Loader } from '@/components/globals/Loader/Loader';
import { EmptyState } from '@/components/globals/EmptyState/EmptyState';
import { AgentRequest } from '@/types/User';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { appovalRequestAgent, approvalListAgent } from '@/lib/fetcher/user';
import { ShowMoreButton } from '@/components/globals/ShowMoreButton/ShowMoreButton';

function InviteActions({ request }: { request: AgentRequest }) {
	const { mutateAsync } = useMutation(appovalRequestAgent(request.id));

	return (
		<div className={styles.invite_actions_container}>
			<>
				<div
					role={'button'}
					onClick={async () => await mutateAsync({ approve: false })}
					className={styles.action}
				>
					<X size={22} />
				</div>
				<div
					role={'button'}
					onClick={async () => await mutateAsync({ approve: true })}
					className={styles.action}
				>
					<Check size={22} />
				</div>
			</>
		</div>
	);
}

export default function Page() {
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(approvalListAgent());

	return (
		<NavigationBarHeader title={'Demandes d’accès agents'}>
			<article className={styles.section}>
				<span className={styles.listSectionTitle}>Demande en cours</span>
				{data === undefined || isLoading ? (
					<EmptyState />
				) : (
					<section className={styles.list}>
						{data.pages.map((row, j) =>
							row.data.map((agent, i) => (
								<ListItem
									key={i}
									title={agent.full_name ?? agent.id}
									description={agent.agent_reason ?? "Aucune raison n'as été soumise."}
									showChevron={false}
									hoverEffect={false}
									rightElement={<InviteActions request={agent} />}
									last={i == row.data.length - 1 && data.pages.length - 1 === j}
								/>
							))
						)}
					</section>
				)}
				{hasNextPage && <ShowMoreButton onClick={() => fetchNextPage()} loading={isFetchingNextPage} />}
				{isLoading && <Loader />}
			</article>
		</NavigationBarHeader>
	);
}
