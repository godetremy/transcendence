'use client';
import styles from './page.module.scss';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { StaffLoginPagesImages } from '@/const/StaffLoginPagesImages';
import { useState } from 'react';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { LoginForm } from '@/components/login/LoginForm/LoginForm';
import { ForgotPasswordParametersSchema } from '@/schema/ForgotPasswordParametersSchema';
import { post } from '@/lib/fetcher';
import { User2 } from 'lucide-react';

export default function Page() {
	const [image] = useState(() => {
		return StaffLoginPagesImages[Math.floor(Math.random() * StaffLoginPagesImages.length)];
	});

	const [requestSent, setRequestSent] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	const sendRequest = async (form: FormData) => {
		const field = ForgotPasswordParametersSchema.safeParse({
			mail: form.get('mail'),
		});

		if (!field.success) {
			setError(field.error.issues[0].message);
			return;
		}

		const res = await post<{ success: boolean; message?: string }>('/auth/forgot-password', field.data);

		if (!res.success) setError(res.message ?? 'Unknown error');
		else setRequestSent(true);
	};

	return (
		<LoginTemplate
			background={{
				source: image.source,
				alt: image.alt,
			}}
			contentClassName={styles.main_container}
		>
			{requestSent ? (
				<>
					<LoginText
						title={'Verifiez votre boite de reception'}
						description={
							'Si un compte est associé à cette adresse e-mail, vous recevrez un e-mail contenant un lien pour réinitialiser votre mot de passe.'
						}
					/>
				</>
			) : (
				<>
					<LoginText
						title={"Verification d'identite"}
						description={
							'Pour réinitialiser votre mot de passe, veuillez fournir votre addresse e-mail de connexion.'
						}
					/>

					<LoginForm
						action={sendRequest}
						inputs={
							<LoginTextInput
								name={'mail'}
								type={'mail'}
								icon={<User2 />}
								nameLabel={'Adresse e-mail de vérification'}
								placeholder={'michel.doe@bde.42angouleme.fr'}
							/>
						}
						error={error}
						submitText={'Réinitialiser mon mot de passe'}
					/>
				</>
			)}
		</LoginTemplate>
	);
}
