'use client';
import './page.scss';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { StaffLoginPagesImages } from '@/const/StaffLoginPagesImages';
import { useState } from 'react';
import { User2 } from 'lucide-react';
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
				title={"Verification d'identite"}
				description={
					'Pour réinitialiser votre mot de passe, veuillez fournir votre addresse e-mail de connexion.'
				}
			/>

			<form>
				<div className={'inputs'}>
					<LoginTextInput
						type={'mail'}
						icon={<User2 />}
						nameLabel={'Adresse e-mail'}
						placeholder={'michel.doe@bde.42angouleme.fr'}
					/>
				</div>

				<input type={'submit'} value={'Réinitialiser mon mot de passe'} />
			</form>
		</LoginTemplate>
	);
}
