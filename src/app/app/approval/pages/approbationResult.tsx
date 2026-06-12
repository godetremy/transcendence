import styles from './approbationResult.module.scss';
import { ApprovalButton, ApprovalPage } from '@/app/app/approval/page';
import { ReactNode } from 'react';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { EmojiSunglasses } from '@/components/stickers/EmojiSunglasses/EmojiSunglasses';
import { EmojiRaisedEyebrow } from '@/components/stickers/EmojiRaisedEyebrow/EmojiRaisedEyebrow';

export function ApprobationResult(approved: boolean, logout: () => void, nextPage: () => void): ApprovalPage {
	const buttons: ApprovalButton[] = approved
		? [{ title: "C'est parti !", onPress: () => {}, primary: true }]
		: [
				{ title: 'Un problème ?', onPress: () => {} },
				{ title: 'Se déconnecter', onPress: logout, primary: true },
			];

	const content: ReactNode = (
		<div className={styles.container}>
			<LoginText
				stickers={approved ? <EmojiSunglasses size={130} /> : <EmojiRaisedEyebrow size={130} />}
				title={approved ? 'Bienvenue' : 'Acces non valide'}
				description={
					approved
						? 'Votre demande a été validée. Vous pouvez désormais accéder à l’ensemble de nos services.'
						: 'Votre demande a été refusée. Si vous estimez qu’il s’agit d’une erreur, veuillez contacter notre équipe.'
				}
			/>
		</div>
	);

	return { content, buttons };
}
