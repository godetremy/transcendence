import styles from './approbationRequired.module.scss';
import { ApprovalButton, ApprovalPage } from '@/app/app/approval/page';
import { ReactNode, useEffect } from 'react';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { sse } from '@/lib/fetcher';

export function Processing(logout: () => void, nextPage: (accepted: boolean) => void): ApprovalPage {
	const buttons: ApprovalButton[] = [{ title: 'Se déconnecter', onPress: logout }];

	useEffect(() => {
		const closeSSE = sse<{ approved: boolean }>('/users/approval/me/status', (res) => {
			if (res.approved !== null) {
				nextPage(res.approved);
				closeSSE();
			}
		});
		return closeSSE;
	}, [nextPage]);

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
