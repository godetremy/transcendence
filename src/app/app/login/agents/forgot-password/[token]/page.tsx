'use client';
import styles from './page.module.scss';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { StaffLoginPagesImages } from '@/const/StaffLoginPagesImages';
import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { LoginForm } from '@/components/login/LoginForm/LoginForm';
import { newPasswordForm } from '@/schema/ForgotPasswordForm';
import { useRouter } from 'next/navigation';

export default function Page() {
	const [image] = useState(() => {
		return StaffLoginPagesImages[Math.floor(Math.random() * StaffLoginPagesImages.length)];
	});

	const [error, setError] = useState<string | undefined>(undefined);
	const route = useRouter();

	const getPassword = async (form: FormData) => {
		const fields = newPasswordForm.safeParse({
			password: form.get('password'),
			passwordCheck: form.get('passwordCheck'),
		});

		if (!fields.success) {
			setError(fields.error.issues[0].message);
			setError('filed problem');
			return;
		}

		const response = await fetch('/app/api/auth/forgot-password/modify-password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				password: fields.data.password,
				passwordCheck: fields.data.passwordCheck,
			}),
		});

		if (response.ok) {
			const data = await response.json();
			setError(data.message);
			route.push(data.redirect);
		}

		return;
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
				title={'Reinitialiser votre mot de passe'}
				description={'Choisissez votre mot de passe pour vous connecter.'}
			/>

			<LoginForm
				action={getPassword}
				inputs={
					<>
						<LoginTextInput
							name={'password'}
							type={'password'}
							icon={<KeyRound />}
							nameLabel={'Mot de passe'}
							placeholder={'••••••••••••'}
						/>
						<LoginTextInput
							name={'passwordCheck'}
							type={'password'}
							icon={<KeyRound />}
							nameLabel={'Confirmation du mot de passe'}
							placeholder={'••••••••••••'}
						/>
					</>
				}
				submitText={'Réinitialiser mon mot de passe'}
				error={error}
			/>
		</LoginTemplate>
	);
}
