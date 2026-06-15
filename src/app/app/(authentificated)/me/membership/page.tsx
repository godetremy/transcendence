'use client';

import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import { ArrowUpRight, Plus } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';

export default function Page() {
	const [balanceHistory, setBalanceHistory] = useState<
		{ title: string; history: { name: string; cost: number }[] }[]
	>([]);

	function generateRandomMonth() {
		const credits = [];

		for (let i = 0; i < Math.random(); i++) {
			const cost = Math.floor(5 - Math.random() * 10) + 1;
			credits.push({
				name: cost < 0 ? 'Adhesion mensuelle' : 'Rechargement de solde',
				cost,
			});
		}

		return credits;
	}

	useEffect(() => {
		const balanceHistory: { title: string; history: { name: string; cost: number }[] }[] = [];
		for (let i = 0; i < 10; i++) {
			balanceHistory.push({
				title: `Mai 2026`,
				history: generateRandomMonth(),
			});
		}
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setBalanceHistory(balanceHistory);
	}, []);

	return (
		<>
			<NavigationBarHeader title={'Ton adhesion'}>
				<section className={styles.section}>
					<div className={styles.balance_card}>
						<span>Mon solde</span>
						<p>42,67€</p>
					</div>
					<div className={styles.balance_action_container}>
						<button className={styles.primary}>
							<Plus /> Recharge
						</button>
						<button className={styles.secondary}>
							<ArrowUpRight /> Virement
						</button>
					</div>
					<span className={styles.listSectionTitle}>Historique</span>
					{balanceHistory.map((balance, i) => (
						<Fragment key={i}>
							<span className={styles.listSectionSubtitle}>{balance.title}</span>
							<div className={styles.list}>
								{balance.history.map((item, j) => (
									<ListItem
										title={item.name}
										description={'Débitée le 11/05/2026 - depuis le solde'}
										rightElement={
											<span
												className={styles.debit}
												style={{
													color: item.cost >= 0 ? '#99FFBA' : '#FE5356',
													backgroundColor: item.cost >= 0 ? '#99FFBA20' : '#FE535620',
												}}
											>
												{`${item.cost >= 0 ? '+' : ''}${item.cost.toFixed(2)}€`}
											</span>
										}
										showChevron={false}
										last={j === balance.history.length - 1}
										key={j}
									/>
								))}
							</div>
						</Fragment>
					))}
				</section>
			</NavigationBarHeader>
		</>
	);
}
