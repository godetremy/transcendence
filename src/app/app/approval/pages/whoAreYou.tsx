import styles from './whoAreYou.module.scss';
import { ApprovalButton, ApprovalPage } from '@/app/app/approval/page';
import { ReactNode, useState } from 'react';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';

export function WhoAreYou(
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
			/>
		</div>
	);

	return { content, buttons };
}
