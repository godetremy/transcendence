'use client';
import './page.scss';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { StaffLoginPagesImages } from '@/const/StaffLoginPagesImages';
import { useState } from 'react';
import { KeyRound, User2 } from 'lucide-react';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { Sublinks } from '@/components/login/Sublinks/Sublinks';
import { LoginText } from '@/components/login/LoginText/LoginText';

export default function Page() {
	const [image] = useState(() => {
		return StaffLoginPagesImages[Math.floor(Math.random() * StaffLoginPagesImages.length)];
	});

	return (
		<LoginTemplate
			background={{
				source: image.source,
				alt: image.alt,
			}}
		>
			<LoginText title={'Cree un compte'} description={'Pour accéder à vos services inscrivez vous.'} />

			<form>
				<div className={'inputs'}>
					<LoginTextInput
						type={'email'}
						icon={<User2 />}
						nameLabel={'Adresse e-mail'}
						placeholder={'michel.doe@bde.42angouleme.fr'}
					/>
					<LoginTextInput
						type={'password'}
						icon={<KeyRound />}
						nameLabel={'Mot de passe'}
						placeholder={'••••••••••••'}
					/>
					<LoginTextInput
						type={'password'}
						icon={<KeyRound />}
						nameLabel={'Confirmation du mot de passe'}
						placeholder={'••••••••••••'}
					/>
				</div>

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
