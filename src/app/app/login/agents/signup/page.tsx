'use client';
import styles from './page.module.scss';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { StaffLoginPagesImages } from '@/const/StaffLoginPagesImages';
import { useState } from 'react';
import { KeyRound, User2 } from 'lucide-react';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { Sublinks } from '@/components/login/Sublinks/Sublinks';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { SignupFormSchema } from '@/schema/SignupForm';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/login/LoginForm/LoginForm';

export default function Page() {
	const [error, setError] = useState<string | undefined>(undefined);
	const [image] = useState(() => {
		return StaffLoginPagesImages[Math.floor(Math.random() * StaffLoginPagesImages.length)];
	});

	const signUp = async (form: FormData) => {
		const fields = SignupFormSchema.safeParse({
			email: form.get('email'),
			password: form.get('password'),
			passwordCheck: form.get('passwordCheck'),
		});

		if (!fields.success) {
			setError(fields.error.issues[0].message);
			return;
		}
		const message = await fetch('/app/api/auth/signup/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: fields.data.email,
				password: fields.data.password,
				passwordCheck: fields.data.passwordCheck,
			}),
		});
		const body = await message.json();
		if (message.ok) return redirect('/app/home/');
		setError(body.message);
	};

	return (
		<LoginTemplate
			background={{
				source: image.source,
				alt: image.alt,
			}}
			contentClassName={styles.main_container}
		>
			<LoginText title={'Cree un compte'} description={'Pour accéder à vos services inscrivez vous.'} />

			<LoginForm
				action={signUp}
				inputs={
					<>
						<LoginTextInput
							name={'email'}
							type={'email'}
							icon={<User2 />}
							nameLabel={'Adresse e-mail'}
							placeholder={'michel.doe@bde.42angouleme.fr'}
						/>
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
				sublinks={
					<Sublinks
						links={[
							{ text: "J'ai déjà un compte.", href: '/app/login/agents' },
							{ text: 'Tu es étudiants ? C’est par ici.', href: '/app/login' },
						]}
					/>
				}
				submitText={'Crée un compte'}
				error={error}
			/>
		</LoginTemplate>
	);
}
