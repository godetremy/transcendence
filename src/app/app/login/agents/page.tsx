'use client';
import './page.scss';
import { Eyes } from '@/components/stickers/eyes/Eyes';
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
			<LoginText
				title={'Connexion Agents'}
				description={'Pour accéder à vos services connectez vous avec vos identifiants.'}
			/>

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
				</div>

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
