'use client';
import './page.scss';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { StaffLoginPagesImages } from '@/const/StaffLoginPagesImages';
import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
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
				title={'Reinitialiser votre mot de passe'}
				description={'Choisissez votre mot de passe pour vous connecter.'}
			/>

			<form>
				<div className={'inputs'}>
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

				<input type={'submit'} value={'Réinitialiser mon mot de passe'} />
			</form>
		</LoginTemplate>
	);
}
