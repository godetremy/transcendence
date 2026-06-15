import styles from './approbationRequired.module.scss';
import { ApprovalButton, ApprovalPage } from '@/app/app/approval/page';
import { ReactNode } from 'react';
import { LoginText } from '@/components/login/LoginText/LoginText';

export function Processing(logout: () => void, nextPage: () => void): ApprovalPage {
	const buttons: ApprovalButton[] = [{ title: 'Se déconnecter', onPress: logout }];

	const content: ReactNode = (
		<div className={styles.container}>
			<LoginText
				title={'En cours de traitement'}
				description={
					'Votre demande a bien été reçue. Elle est actuellement en cours d’examen par notre équipe. Vous serez informé dès qu’une décision sera prise.'
				}
			/>
		</div>
	);

	return { content, buttons };
}
