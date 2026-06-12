import styles from './approbationRequired.module.scss';
import { ApprovalButton, ApprovalPage } from '@/app/app/approval/page';
import { ReactNode } from 'react';
import { LoginText } from '@/components/login/LoginText/LoginText';

export function ApprobationRequired(logout: () => void, nextPage: () => void): ApprovalPage {
	const buttons: ApprovalButton[] = [
		{ title: 'Se déconnecter', onPress: logout },
		{ title: 'Continuer', onPress: nextPage, primary: true },
	];

	const content: ReactNode = (
		<div className={styles.container}>
			<LoginText
				title={'Approbation necessaire'}
				description={
					'Avant l’accès à nos services, une approbation est requise. Afin de faciliter le traitements, merci de répondre aux questions suivantes.'
				}
			/>
		</div>
	);

	return { content, buttons };
}
