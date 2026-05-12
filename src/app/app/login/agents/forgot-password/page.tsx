'use client';
import './page.scss';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { StaffLoginPagesImages } from '@/const/StaffLoginPagesImages';
import { useState } from 'react';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { isAccountExistByMail } from '@/database/users/isAccountExist';
import { forgotPasswordForm } from '@/schema/ForgotPasswordForm';
import { User2 } from 'lucide-react';

export default function Page() {
	const [image] = useState(() => {
		return StaffLoginPagesImages[Math.floor(Math.random() * StaffLoginPagesImages.length)];
	});
	const [error, setError] = useState<string | null>(null);

	const getEmail = async (form: FormData) => {
		const field = forgotPasswordForm.safeParse({
			email: form.get('email'),
		});
		if (!field.success) setError(field.error.issues[0].message);
		else {
			const exist = await isAccountExistByMail(field.data.email);
			if (exist) setError(field.data.email);
		}
	};

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

			<form action={getEmail}>
				<div className={'inputs'}>
					<LoginTextInput
						name={'email'}
						type={'email'}
						icon={<User2 />}
						nameLabel={'Adresse e-mail'}
						placeholder={'michel.doe@bde.42angouleme.fr'}
					/>
				</div>

				{error && <p>{error}</p>}

				<input type={'submit'} value={'Réinitialiser mon mot de passe'} />
			</form>
		</LoginTemplate>
	);
}
