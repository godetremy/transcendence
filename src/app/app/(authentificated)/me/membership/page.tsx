'use client';

import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/globals/Card/Card';
import { CheckoutCard } from '@/components/globals/CheckoutCard/CheckoutCard';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getBalance, getTransactions } from '@/lib/fetcher/user';
import { useUser } from '@/contexts/UserContext';
import { User } from '@/types/User';
import { Loader } from '@/components/globals/Loader/Loader';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import { EmptyState } from '@/components/globals/EmptyState/EmptyState';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import Image from 'next/image';

export default function Page() {
	const [showReload, setShowReload] = useState<boolean>(false);
	const userCtx = useUser();
	const [user] = useState<User>(userCtx!);

	const { data: balance, isError: isBalanceError, error } = useQuery(getBalance(user.id));

	const {
		data: transations,
		isLoading: isTransactionLoading,
		isError: isTransactionError,
	} = useInfiniteQuery({
		...getTransactions(user.id, balance?.id ?? ''),
		enabled: balance?.id !== undefined,
	});

	if (isBalanceError || isTransactionError) return <ErrorState error={error} />;

	return (
		<>
			<NavigationBarHeader title={'Ton adhesion'}>
				<section className={styles.section}>
					<div className={styles.balance_card}>
						<span>Mon solde</span>
						<p className={balance ? undefined : styles.skeleton}>
							{balance ? `${balance.account}` : '100'}{' '}
							<Image src={'/images/coin.svg'} alt={'coins'} width={35} height={35} />
						</p>
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
					</div>
					<span className={styles.listSectionTitle}>Historique</span>
					{isTransactionLoading || transations === undefined ? (
						<Loader />
					) : transations.pages[0].data.length === 0 ? (
						<EmptyState title="Tu n'as fait aucun achats..." description="Et si tu essayez pour voir ?" />
					) : (
						<ListContainer>
							{transations.pages.map((row) =>
								row.data.map((transaction, i) => (
									<ListItem
										title={transaction.name ?? ''}
										description={'Débitée le 11/05/2026 - depuis le solde'}
										rightElement={
											<span
												className={styles.debit}
												style={{
													color: transaction.amount >= 0 ? '#99FFBA' : '#FE5356',
													backgroundColor:
														transaction.amount >= 0 ? '#99FFBA20' : '#FE535620',
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
						</ListContainer>
					)}
				</section>
				<Card visible={showReload} requestClose={() => setShowReload(false)}>
					<CheckoutCard close={() => setShowReload(false)} />
				</Card>
			</NavigationBarHeader>
		</>
	);
}
