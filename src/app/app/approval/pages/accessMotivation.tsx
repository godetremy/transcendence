import styles from './accessMotivation.module.scss';
import { ApprovalButton, ApprovalPage } from '@/app/app/approval/page';
import { ReactNode } from 'react';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';

export function AccessMotivation(
	logout: () => void,
	nextPage: () => void,
	loading: boolean,
	setLoading: (v: boolean) => void
): ApprovalPage {
	const saveValue = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			nextPage();
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
			/>
		</div>
	);

	return { content, buttons };
}
