import styles from './approbationResult.module.scss';
import { ApprovalButton, ApprovalPage } from '@/app/app/approval/page';
import { ReactNode } from 'react';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { EmojiRaisedEyebrow } from '@/components/stickers/EmojiRaisedEyebrow/EmojiRaisedEyebrow';
import EmojiSunglasses from '@/components/stickers/EmojiSunglasses/EmojiSunglasses';
import { useRouter } from 'next/navigation';
import { post } from '@/lib/fetcher';

export function ApprobationResult(
	approved: boolean,
	logout: () => void,
	setLoading: (v: boolean) => void
): ApprovalPage {
	const router = useRouter();

	const refreshToken = () => {
		setLoading(true);
		setTimeout(() => {
			post<{ success: boolean }>('/auth/refresh', {})
				.then(() => router.replace('/app'))
				.catch((err) => console.error(err))
				.finally(() => setLoading(false));
		}, 800);
	};

	const openSupport = () => {
		router.push(`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`);
	};

	const buttons: ApprovalButton[] = approved
		? [{ title: "C'est parti !", onPress: refreshToken, primary: true, canLoad: true }]
		: [
				{ title: 'Un problème ?', onPress: openSupport },
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
