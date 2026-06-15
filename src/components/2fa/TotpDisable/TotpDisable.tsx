import styles from './page.module.scss';
import { Loader } from '@/components/globals/Loader/Loader';
import { useState } from 'react';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { post } from '@/lib/fetcher';
import { TwoFactorAuthentificationInput } from '@/components/login/TwoFactorAuthentificationInput/TwoFactorAuthentificationInput';

export function TotpDisable({ close }: { close: (disbaled: boolean) => void }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	const check = (code: string) => {
		setLoading(true);
		setTimeout(
			() =>
				post<{ success: boolean; message?: string }>('/users/me/2fa/configure/totp', {
					code,
					enable: false,
				}).then((res) => {
					if (res.success) {
						close(true);
						return;
					}
					setError(res.message);
					setLoading(false);
				}),
			800
		);
	};

	return (
		<div className={styles.main_container}>
			<LoginText
				title={'Petite verification'}
				description={'Afin de terminer la configuration, rentre le code OTP visible dans ton trousseau.'}
			/>
			<div className={styles.code_container}>
				<TwoFactorAuthentificationInput submit={check} disable={loading} />
				{error && <p>{error}</p>}
			</div>
			<button onClick={() => setError('Le code est invalide.')} className={styles.primary} disabled={loading}>
				{loading && <Loader size={30} />}
				Désactiver l&#39;authentification par TOTP
			</button>
		</div>
	);
}
