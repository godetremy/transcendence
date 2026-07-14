import styles from './page.module.scss';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { User } from '@/types/User';
import { useMutation } from '@tanstack/react-query';
import { updateBalance } from '@/lib/fetcher/user';
import { SumupCreateCheckouts } from '@/types/SumupCreateCheckouts';
import { redirect } from 'next/navigation';

export function SumupReload() {
	const userCtx = useUser();
	const [user] = useState<User>(userCtx!);
	const [checkout, setCheckout] = useState<SumupCreateCheckouts>({
		amount: 10,
		description: 'rechargement du solde',
	});
	const update = useMutation(updateBalance(user?.id ?? ''));

	return (
		<div className={styles.main_container}>
			<p className={styles.tittle}>Montant</p>
			<div className={styles.container}>
				<div className={styles.addbutton}>
					<button
						className={styles.button}
						onClick={() =>
							setCheckout((prev) => ({ ...prev, amount: prev.amount - 1 }) as SumupCreateCheckouts)
						}
					>
						<Minus />
					</button>
					<input
						className={styles.input}
						value={checkout.amount}
						type="number"
						onChange={(e) =>
							setCheckout((prev) => ({ ...prev, amount: Number(e.target.value) }) as SumupCreateCheckouts)
						}
					/>
					<button
						className={styles.button}
						onClick={() =>
							setCheckout((prev) => ({ ...prev, amount: prev.amount + 1 }) as SumupCreateCheckouts)
						}
					>
						<Plus />
					</button>
				</div>
				<button
					className={styles.button}
					onClick={async () => {
						update.mutateAsync({ checkout: checkout }).then((value) => {
							redirect(value.redirect_url);
						});
					}}
				>
					Valider ( montant en points {checkout?.amount * 10} )
				</button>
			</div>
		</div>
	);
}
