import styles from './component.module.scss';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { User } from '@/types/User';
import { useMutation } from '@tanstack/react-query';
import { updateBalance } from '@/lib/fetcher/user';
import { SumupCreateCheckouts } from '@/types/SumupCreateCheckouts';
import { redirect } from 'next/navigation';
import { CardHeader } from '@/components/globals/CardHeader/CardHeader';
import Image from 'next/image';
import { Loader } from '@/components/globals/Loader/Loader';

const AMOUNT_OPTIONS = [5, 10, 15, 20, 50];

export function CheckoutCard({ close }: { close: () => void }) {
	const userCtx = useUser();
	const [user] = useState<User>(userCtx!);
	const [checkout, setCheckout] = useState<SumupCreateCheckouts>({
		amount: 10,
		description: 'rechargement du solde',
	});
	const { mutateAsync: proceedToCheckout, isPending } = useMutation(updateBalance(user?.id ?? ''));

	return (
		<div className={styles.main_container}>
			<CardHeader title={'Recharger mon soldes'} onClose={close} />
			<div className={styles.container}>
				<div className={styles.input_container}>
					<button
						disabled={isPending}
						onClick={() =>
							setCheckout(
								(prev) => ({ ...prev, amount: Math.max(1, prev.amount - 1) }) as SumupCreateCheckouts
							)
						}
					>
						<Minus size={32} strokeWidth={3} />
					</button>

					<div className={styles.price_container}>
						<p>
							<input
								disabled={isPending}
								value={checkout.amount}
								type="number"
								min={0}
								max={1000}
								onChange={(e) => {
									const value = Number(e.target.value);
									setCheckout((prev) => ({
										...prev,
										amount: Number.isNaN(value) ? 0 : Math.min(1000, Math.max(0, value)),
									}));
								}}
							/>
							€
						</p>
						<span>
							Soit {checkout.amount * 10}{' '}
							<Image src={'/images/coin.svg'} alt={'coin'} width={16} height={16} />
						</span>
					</div>

					<button
						disabled={isPending}
						onClick={() =>
							setCheckout(
								(prev) => ({ ...prev, amount: Math.max(1, prev.amount + 1) }) as SumupCreateCheckouts
							)
						}
					>
						<Plus size={32} strokeWidth={3} />
					</button>
				</div>
				<div className={styles.options_container}>
					{AMOUNT_OPTIONS.map((amount, i) => (
						<button
							key={i}
							onClick={() =>
								setCheckout((prev) => ({
									...prev,
									amount,
								}))
							}
							disabled={isPending}
						>
							{amount}€
						</button>
					))}
				</div>
				<button
					className={styles.cta_button}
					disabled={isPending}
					onClick={async () => {
						if (checkout.amount <= 0) return;
						proceedToCheckout({ checkout: checkout }).then((value) => {
							redirect(value.redirect_url);
						});
					}}
				>
					{isPending && <Loader size={24} />}
					{isPending ? 'Redirection en cours...' : 'Procéder au paiement'}
				</button>
			</div>
		</div>
	);
}
