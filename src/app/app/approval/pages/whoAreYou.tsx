import styles from './whoAreYou.module.scss';
import { ApprovalButton, ApprovalPage } from '@/app/app/approval/page';
import { ReactNode, useState } from 'react';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { patch } from '@/lib/fetcher';
import { UserUpdateParametersSchema } from '@/schema/UserUpdateParametersSchema';

export function WhoAreYou(
	logout: () => void,
	nextPage: () => void,
	loading: boolean,
	setLoading: (v: boolean) => void
): ApprovalPage {
	const [error, setError] = useState<string | undefined>(undefined);
	const [fullName, setFullName] = useState('');

	const saveValue = () => {
		setLoading(true);
		const fields = UserUpdateParametersSchema.safeParse({ full_name: fullName });

		if (!fields.success) {
			setError(fields.error.issues[0].message);
			setLoading(false);
			return;
		}

		setTimeout(() => {
			patch<{ success: boolean }>('/users/me', {
				full_name: fullName,
			})
				.then(() => {
					nextPage();
				})
				.catch((err: Error) => {
					setError(err.message);
				})
				.finally(() => setLoading(false));
		}, 1000);
	};

	const buttons: ApprovalButton[] = [
		{ title: 'Se déconnecter', onPress: logout },
		{ title: 'Continuer', onPress: saveValue, primary: true, canLoad: true },
	];

	const content: ReactNode = (
		<div className={styles.container}>
			<LoginText
				title={'Qui etes-vous ?'}
				description={
					'Afin de mieux vous connaître, merci de nous indiquer votre identité ainsi que toute information utile vous concernant.'
				}
			/>
			<LoginTextInput
				nameLabel={'Nom de l’entreprise'}
				placeholder={'BDE 42 Angoulême'}
				required
				disabled={loading}
				value={fullName}
				onChange={(e) => setFullName(e.currentTarget.value)}
			/>
			{error && <p className={styles.error}>{error}</p>}
		</div>
	);

	return { content, buttons };
}
