'use client';

import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/globals/Card/Card';
import { SumupReload } from '@/components/sumup/SumupReload';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getBalance, getTransactions } from '@/lib/fetcher/user';
import { useUser } from '@/contexts/UserContext';
import { User } from '@/types/User';
import { Loader } from '@/components/globals/Loader/Loader';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';

export default function Page() {
	const [showReload, setShowReload] = useState<boolean>(false);
	const userCtx = useUser();
	const [user] = useState<User>(userCtx!);

	const { data, isLoading, isError, error } = useQuery(getBalance(user.id));

	const lists = useInfiniteQuery({
		...getTransactions(user.id, data?.id ?? ''),
		enabled: !!data?.id,
	});

	if (isLoading || lists.isLoading) return <Loader />;
	if (isError || data === undefined || lists.isError || lists.data == undefined) return <ErrorState error={error} />;

	return (
		<>
			<NavigationBarHeader title={'Ton adhesion'}>
				<section className={styles.section}>
					<div className={styles.balance_card}>
						<span>Mon solde</span>
						<p>{data.account} Points</p>
					</div>
					<div className={styles.balance_action_container}>
						<button
							className={styles.primary}
							onClick={async () => {
								setShowReload(true);
							}}
						>
							<Plus /> Recharge
						</button>
						<button className={styles.secondary}>
							<ArrowUpRight /> Virement
						</button>
					</div>
					<span className={styles.listSectionTitle}>Historique</span>
					<div className={styles.list}>
						{lists.data.pages.map((row) =>
							row.data.map((transaction, i) => (
								<ListItem
									title={transaction.name ?? ''}
									description={'Débitée le 11/05/2026 - depuis le solde'}
									rightElement={
										<span
											className={styles.debit}
											style={{
												color: transaction.amount >= 0 ? '#99FFBA' : '#FE5356',
												backgroundColor: transaction.amount >= 0 ? '#99FFBA20' : '#FE535620',
											}}
										>
											{`${transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}€`}
										</span>
									}
									showChevron={false}
									last={i === row.data.length - 1}
									key={i}
								/>
							))
						)}
						{lists.isFetchingNextPage && <p>Chargement...</p>}

						{lists.hasNextPage && (
							<button onClick={() => lists.fetchNextPage()} disabled={lists.isFetchingNextPage}>
								{lists.isFetchingNextPage ? 'Chargement...' : 'Voir la suite'}
							</button>
						)}
					</div>
				</section>
				<Card visible={showReload} requestClose={() => setShowReload(false)}>
					<SumupReload />
				</Card>
			</NavigationBarHeader>
		</>
	);
}
