'use client';
import './page.scss';
import { Eyes } from '@/components/stickers/eyes/Eyes';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { StaffLoginPagesImages } from '@/const/StaffLoginPagesImages';
import { useState } from 'react';
import { KeyRound, User2 } from 'lucide-react';
import { InputTemplate } from '@/components/login/loginTemplate/signupTemplate/InputTemplate';

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
			<Eyes className={'stickers'} />

			<div className={'text'}>
				<h1>Connexion Agents</h1>
				<p>Pour accéder à vos services connectez vous avec vos identifiants.</p>
			</div>

			<form>
				<div className={'inputs'}>
					<InputTemplate
						icon={<User2 />}
						nameLabel={'Adresse e-mail'}
						inside={'michel.doe@bde.42angouleme.fr'}
					/>
					<InputTemplate
						icon={<KeyRound />}
						nameLabel={'Mot de passe'}
						inside={'••••••••••••'}
					/>
				</div>
				<div className={'sublinks'}>
					<a href={'/app/login/agents'}>Mots de passe oublié ?</a>
					<a href={'/app/login/agents/signup'}>Crée un nouveau compte.</a>
					<a href={'/app/login'}>Tu es étudiants ? C’est par ici.</a>
				</div>

				<input type={'submit'} value={'Connexion'} />
			</form>
		</LoginTemplate>
	);
}
