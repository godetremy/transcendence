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
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import { useToast, ToastType } from '@/components/globals/ToastProvider/ToastProvider';

function InviteActions({ request }: { request: AgentRequest }) {
	const { mutateAsync } = useMutation(appovalRequestAgent(request.id));
	const toast = useToast();

	return (
		<div className={styles.invite_actions_container}>
			<>
				<div
					role="button"
					className={styles.action}
					onClick={async () => {
						try {
							await mutateAsync({ approve: false });

							toast.showToast({
								title: 'Succès',
								message: "L'invitation a été refusée.",
								type: ToastType.SUCCESS,
							});
						} catch (error) {
							console.error(error);

							toast.showToast({
								title: 'Erreur',
								message: "Impossible de refuser l'invitation.",
								type: ToastType.ERROR,
							});
						}
					}}
				>
					<X size={22} />
				</div>

				<div
					role="button"
					className={styles.action}
					onClick={async () => {
						try {
							await mutateAsync({ approve: true });

							toast.showToast({
								title: 'Succès',
								message: "L'invitation a été acceptée.",
								type: ToastType.SUCCESS,
							});
						} catch (error) {
							console.error(error);

							toast.showToast({
								title: 'Erreur',
								message: "Impossible d'accepter l'invitation.",
								type: ToastType.ERROR,
							});
						}
					}}
				>
					<Check size={22} />
				</div>
			</>
		</div>
	);
}

export default function Page() {
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error } =
		useInfiniteQuery(approvalListAgent());

	return (
		<NavigationBarHeader title={'Demandes d’accès agents'}>
			<article className={styles.section}>
				<span className={styles.listSectionTitle}>Demande en cours</span>
				{isLoading && <Loader />}
				{data && (
					<>
						{data.pages.length === 1 && data.pages[0].data.length === 0 ? (
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
					</>
				)}
				{hasNextPage && <ShowMoreButton onClick={() => fetchNextPage()} loading={isFetchingNextPage} />}
				{isError && <ErrorState error={error} />}
			</article>
		</NavigationBarHeader>
	);
}
