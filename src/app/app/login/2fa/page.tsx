'use client';
import styles from './page.module.scss';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { useState } from 'react';
import { StudentLoginPagesImages } from '@/const/StudentLoginPagesImages';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { TwoFactorAuthentificationInput } from '@/components/login/TwoFactorAuthentificationInput/TwoFactorAuthentificationInput';
import { LoginForm } from '@/components/login/LoginForm/LoginForm';

export default function Page() {
	const [image] = useState(() => {
		return StudentLoginPagesImages[Math.floor(Math.random() * StudentLoginPagesImages.length)];
	});

	const [checking, setChecking] = useState(false);
	const [error, setError] = useState('');

	const checkCode = (code: string) => {
		setChecking(true);
		setTimeout(() => {
			setError('Le code est invalide.');
			setChecking(false);
		}, 2000);
	};

	return (
		<LoginTemplate
			background={{
				source: image.source,
				alt: image.alt,
			}}
			contentClassName={styles.main_container}
		>
			<LoginText
				title={'Verification Identite'}
				description={'Pour vérifier votre identité, nous avons envoyer un code à l’adresse tcy***@g***.c**.'}
			/>

			<LoginForm
				action={() => setError('Le code de vérification est incomplet.')}
				inputs={<TwoFactorAuthentificationInput submit={checkCode} disable={checking} />}
				submitText={checking ? 'Vérification...' : 'Valider'}
				submitDisabled={checking}
				loading={checking}
				error={error}
			/>
		</LoginTemplate>
	);
}
