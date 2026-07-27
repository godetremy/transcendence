import styles from './page.module.scss';
import { Loader } from '@/components/globals/Loader/Loader';
import { ReactNode, useEffect, useState } from 'react';
import { ApprovalButton, ApprovalPage } from '@/app/app/approval/page';
import { LoginText } from '@/components/login/LoginText/LoginText';
import QRCode from 'react-qr-code';
import { get, post } from '@/lib/fetcher';
import { Eyes } from '@/components/stickers/Eyes/Eyes';
import { TwoFactorAuthentificationInput } from '@/components/login/TwoFactorAuthentificationInput/TwoFactorAuthentificationInput';

function AddThisQRCode(cancel: () => void, nextPage: () => void): ApprovalPage {
	const [qrUri, setQrUri] = useState<string | undefined>(undefined);

	const buttons: ApprovalButton[] = [
		{ title: 'Annuler', onPress: cancel },
		{ title: "C'est bon pour moi !", onPress: nextPage, primary: true },
	];

	useEffect(() => {
		get<{ success: boolean; uri?: string }>('/users/me/2fa/configure/totp').then((res) => {
			if (res.success) setQrUri(res.uri!);
		});
	}, []);

	const content: ReactNode = (
		<div className={styles.container}>
			<LoginText
				stickers={<Eyes width={80} />}
				title={'Ajoute ce QR code a ton trousseau'}
				description={
					'Associe une application TOTP à ton compte afin de renforcer sa sécurité. Scannez le QR code ci dessous, puis appuie sur le bouton en bas de la page pour continuer.'
				}
			/>
			<a className={styles.qr_container} href={qrUri}>
				{qrUri ? <QRCode value={qrUri} size={220} /> : <Loader dark size={64} />}
				<p>Ouvrir dans le trousseau</p>
			</a>
		</div>
	);

	return { content, buttons };
}

function CodeCheck(goBack: () => void, close: () => void, load: boolean, setLoad: (v: boolean) => void): ApprovalPage {
	const [error, setError] = useState<string | undefined>(undefined);

	const check = (code: string) => {
		setLoad(true);
		setTimeout(
			() =>
				post<{ success: boolean; message?: string }>('/users/me/2fa/configure/totp', {
					code,
					enable: true,
				}).then((res) => {
					if (res.success) {
						close();
						return;
					}
					setError(res.message);
					setLoad(false);
				}),
			800
		);
	};

	const buttons: ApprovalButton[] = [
		{ title: 'Revenir en arrière', onPress: goBack },
		{ title: 'Valider', onPress: () => setError('Le code est invalide.'), primary: true, canLoad: true },
	];

	const content: ReactNode = (
		<div className={styles.container}>
			<LoginText
				stickers={<Eyes width={80} />}
				title={'Petite verification'}
				description={'Afin de terminer la configuration, rentre le code OTP visible dans ton trousseau.'}
			/>
			<div className={styles.code_container}>
				<TwoFactorAuthentificationInput submit={check} disable={load} />
				{error && <p>{error}</p>}
			</div>
		</div>
	);

	return { content, buttons };
}

export function TotpConfiguration({ requestClose, forceClose }: { requestClose: () => void; forceClose: () => void }) {
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);

	const backPage = () => {
		setPage((p) => p - 1);
	};

	const nextPage = () => {
		setPage((p) => p + 1);
	};

	const content: ApprovalPage[] = [
		AddThisQRCode(requestClose, nextPage),
		CodeCheck(backPage, forceClose, loading, setLoading),
	];

	return (
		<div className={styles.main_container}>
			<div className={styles.progress_indicator_container}>
				{content.map((_, i) => (
					<div className={`${styles.bar} ${page >= i ? styles.active : ''}`} key={i} />
				))}
			</div>
			<div className={styles.pages_container}>
				{content.map((item, i) => (
					<div
						key={i}
						style={{ transform: `translateX(${page === i ? 0 : 40 * (page < i ? 1 : -1)}px)` }}
						className={`${styles.page} ${page !== i ? styles.hidden : ''}`}
					>
						{item.content}
					</div>
				))}
			</div>
			{content[page].buttons.map((button, i) => (
				<button
					key={`${content[page].buttons.length - i}`}
					onClick={button.onPress}
					className={`${styles.button} ${button.primary ? styles.primary : ''}`}
					disabled={loading}
				>
					{loading && button.canLoad && <Loader size={30} />}
					{button.title}
				</button>
			))}
		</div>
	);
}
