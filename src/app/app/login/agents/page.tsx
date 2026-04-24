'use client';
import './page.scss';
import { Eyes } from '@/components/stickers/eyes/Eyes';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { StaffLoginPagesImages } from '@/const/StaffLoginPagesImages';
import { useState } from 'react';
import { KeyRound, User2 } from 'lucide-react';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';

export default function Page() {
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
