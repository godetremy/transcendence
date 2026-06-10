'use client';
import './page.scss';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { StaffLoginPagesImages } from '@/const/StaffLoginPagesImages';
import { useState } from 'react';
import { KeyRound, User2 } from 'lucide-react';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { Sublinks } from '@/components/login/Sublinks/Sublinks';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { SignupFormSchema } from '@/schema/SignupForm';
import { redirect } from 'next/navigation';

export default function Page() {
	const [image] = useState(() => {
		return StaffLoginPagesImages[Math.floor(Math.random() * StaffLoginPagesImages.length)];
	});
	const [error, setError] = useState<string>();

	const login = async (form: FormData) => {
		const fields = SignupFormSchema.safeParse({
			email: form.get('email'),
			password: form.get('password'),
			passwordCheck: form.get('password'),
		});

		if (!fields.success) {
			setError(fields.error.issues[0].message);
			return;
		}
		const message = await fetch('/app/api/auth/signin/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: fields.data.email,
				password: fields.data.password,
			}),
		});
		const body = await message.json();
		setError(body.message);
		if (message.ok) return redirect('/app/home/');
	};

	return (
		<LoginTemplate
			background={{
				source: image.source,
				alt: image.alt,
			}}
		>
			<LoginText
				title={'Connexion Agents'}
				description={'Pour accéder à vos services connectez vous avec vos identifiants.'}
			/>

			<form action={login}>
				<div className={'inputs'}>
					<LoginTextInput
						type={'email'}
						icon={<User2 />}
						nameLabel={'Adresse e-mail'}
						placeholder={'michel.doe@bde.42angouleme.fr'}
						name="email"
					/>
					<LoginTextInput
						type={'password'}
						icon={<KeyRound />}
						nameLabel={'Mot de passe'}
						placeholder={'••••••••••••'}
						name="password"
					/>
				</div>

				{error && <p>{error}</p>}

				<Sublinks
					links={[
						{ text: 'Mots de passe oublié ?', href: '/app/login/agents/forgot-password' },
						{ text: 'Crée un nouveau compte.', href: '/app/login/agents/signup' },
						{ text: 'Tu es étudiants ? C’est par ici.', href: '/app/login' },
					]}
				/>

				<input type={'submit'} value={'Connexion'} />
			</form>
		</LoginTemplate>
	);
}
