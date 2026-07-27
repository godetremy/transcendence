import styles from './accessMotivation.module.scss';
import { ApprovalButton, ApprovalPage } from '@/app/app/approval/page';
import { ReactNode, useState } from 'react';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { UserUpdateParametersSchema } from '@/schema/UserUpdateParametersSchema';
import { patch } from '@/lib/fetcher';

export function AccessMotivation(
	logout: () => void,
	nextPage: () => void,
	loading: boolean,
	setLoading: (v: boolean) => void
): ApprovalPage {
	const [error, setError] = useState<string | undefined>(undefined);
	const [reason, setReason] = useState('');

	const saveValue = () => {
		setLoading(true);
		const fields = UserUpdateParametersSchema.safeParse({ agent_reason: reason });

		if (!fields.success) {
			setError(fields.error.issues[0].message);
			setLoading(false);
			return;
		}

		setTimeout(() => {
			patch<{ success: boolean }>('/users/me', {
				agent_reason: reason,
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
				title={'Motivation d’acces'}
				description={
					'Expliquez brièvement les raisons pour lesquelles vous souhaitez utiliser nos services et ce que vous recherchez.'
				}
			/>
			<LoginTextInput
				nameLabel={'Raison'}
				placeholder={'Je propose régulièrement des événements...'}
				required
				disabled={loading}
				useTextArea={true}
				value={reason}
				onChange={(e) => setReason(e.currentTarget.value)}
			/>
			{error && <p className={styles.error}>{error}</p>}
		</div>
	);

	return { content, buttons };
}
