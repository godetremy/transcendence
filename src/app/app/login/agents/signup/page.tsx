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
	const [message, setMessage] = useState<string | null>(null);
	const [image] = useState(() => {
		return StaffLoginPagesImages[Math.floor(Math.random() * StaffLoginPagesImages.length)];
	});

	const signUp = async (form: FormData) => {
		const fields = SignupFormSchema.safeParse({
			mail: form.get('mail'),
			password: form.get('password'),
			passwordCheck: form.get('passwordCheck'),
		});

		if (!fields.success) {
			setMessage(fields.error.issues[0].message);
			return;
		}
		const message = await fetch('/app/api/auth/signup/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				mail: fields.data.mail,
				password: fields.data.password,
				passwordCheck: fields.data.passwordCheck,
			}),
		});
		const body = await message.json();
		setMessage(body.message);
		if (message.ok) return redirect('/app/home/');
	};

	return (
		<LoginTemplate
			background={{
				source: image.source,
				alt: image.alt,
			}}
		>
			<LoginText title={'Cree un compte'} description={'Pour accéder à vos services inscrivez vous.'} />

			<form action={signUp}>
				<div className={'inputs'}>
					<LoginTextInput
						name={'mail'}
						type={'mail'}
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
				</div>

				{message && <p>{message}</p>}

				<Sublinks
					links={[
						{ text: "J'ai déjà un compte.", href: '/app/login/agents' },
						{ text: 'Tu es étudiants ? C’est par ici.', href: '/app/login' },
					]}
				/>

				<input type={'submit'} value={'Crée un compte'} />
			</form>
		</LoginTemplate>
	);
}
