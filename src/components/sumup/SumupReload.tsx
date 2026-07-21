import styles from './page.module.scss';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { User } from '@/types/User';
import { useMutation } from '@tanstack/react-query';
import { updateBalance } from '@/lib/fetcher/user';
import { SumupCreateCheckouts } from '@/types/SumupCreateCheckouts';
import { redirect } from 'next/navigation';
import { CardHeader } from '@/components/globals/CardHeader/CardHeader';

const autoAmount = [1, 2, 5, 10, 20];

export function SumupReload({ close }: { close: () => void }) {
	const userCtx = useUser();
	const [user] = useState<User>(userCtx!);
	const [checkout, setCheckout] = useState<SumupCreateCheckouts>({
		amount: 10,
		description: 'rechargement du solde',
	});
	const update = useMutation(updateBalance(user?.id ?? ''));
	return (
		<div className={styles.main_container}>
			<CardHeader title={'Recharge'} onClose={close} />
			<div className={styles.container}>
				<div className={styles.center_content}>
					<div className={styles.add_button}>
						<button
							className={styles.button}
							onClick={() =>
								setCheckout(
									(prev) =>
										({ ...prev, amount: Math.max(0, prev.amount - 1) }) as SumupCreateCheckouts
								)
							}
						>
							<Minus />
						</button>
						<div className={styles.amount_display}>
							<div className={styles.amount_row}>
								<input
									className={styles.input}
									value={checkout.amount}
									type="number"
									min={0}
									max={100}
									style={{ width: `${String(checkout.amount).length}ch` }}
									id="amount"
									onKeyDown={(e) => {
										if (e.key === '-' || e.key === 'e') e.preventDefault();
									}}
									onChange={(e) => {
										const value = Number(e.target.value);
										setCheckout((prev) => ({
											...prev,
											amount: Number.isNaN(value) ? 0 : Math.min(100, Math.max(0, value)),
										}));
									}}
								/>
								<span className={styles.euro}>€</span>
							</div>
							<span className={styles.conversion_point}>{checkout.amount * 10} pts</span>
							<div className={styles.auto_amount}>
								{autoAmount.map((amount) => (
									<button
										key={amount}
										className={`${styles.auto_amount_button} ${
											checkout.amount === amount ? styles.selected : ''
										}`}
										onClick={() =>
											setCheckout((prev) => ({
												...prev,
												amount,
											}))
										}
									>
										{amount} €
									</button>
								))}
							</div>
						</div>
						<button
							className={styles.button}
							onClick={() =>
								setCheckout(
									(prev) =>
										({
											...prev,
											amount: Math.min(100, Math.max(0, prev.amount + 1)),
										}) as SumupCreateCheckouts
								)
							}
						>
							<Plus />
						</button>
					</div>
				</div>
				<button
					className={`${styles.button} ${styles.button_finish}`}
					onClick={async () => {
						if (checkout.amount <= 0) return;
						update.mutateAsync({ checkout: checkout }).then((value) => {
							redirect(value.redirect_url);
						});
					}}
				>
					Valider mon payment
				</button>
			</div>
		</div>
	);
}
