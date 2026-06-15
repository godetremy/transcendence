'use client';
import styles from './page.module.scss';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { StaffLoginPagesImages } from '@/const/StaffLoginPagesImages';
import { useState } from 'react';
import { KeyRound, User2 } from 'lucide-react';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { Sublinks } from '@/components/login/Sublinks/Sublinks';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/login/LoginForm/LoginForm';
import { post } from '@/lib/fetcher';
import { TwoFactorAuthentificationInput } from '@/components/login/TwoFactorAuthentificationInput/TwoFactorAuthentificationInput';
import { AgentsLoginParametersSchema } from '@/schema/AgentsLoginParametersSchema';
import { ERRORS_DETAILS } from '@/utils/errors';

export default function Page() {
	const [image] = useState(() => {
		return StaffLoginPagesImages[Math.floor(Math.random() * StaffLoginPagesImages.length)];
	});
	const [error, setError] = useState<string>();
	const [loading, setLoading] = useState<boolean>(false);
	const [show2FA, setShow2FA] = useState(false);

	const [mail, setMail] = useState('');
	const [password, setPassword] = useState('');

	const login = async () => {
		setLoading(true);
		const fields = AgentsLoginParametersSchema.safeParse({
			mail: mail,
			password: password,
		});

		if (!fields.success) {
			setError(fields.error.issues[0].message);
			setLoading(false);
			return;
		}
		setTimeout(
			async () =>
				await post<{ success: boolean; message?: string }>('/auth/login/', fields.data).then((res) => {
					if (!res.success) {
						if (res.message === ERRORS_DETAILS.two_factor_auth_required().message) {
							setLoading(false);
							setShow2FA(true);
							return;
						}
						setError(res.message);
						setLoading(false);
					} else return redirect('/app/home/');
				}),
			2000
		);
	};

	const totpLogin = async (code: string) => {
		setLoading(true);
		const fields = AgentsLoginParametersSchema.safeParse({
			mail: mail,
			password: password,
			method: 'totp',
			code: code,
		});

		if (!fields.success) {
			setError(fields.error.issues[0].message);
			setLoading(false);
			return;
		}

		setTimeout(
			async () =>
				await post<{ success: boolean; message?: string }>('/auth/login/', fields.data).then((res) => {
					if (!res.success) {
						if (res.message === ERRORS_DETAILS.invalid_totp_code().message) {
							setLoading(false);
							setError(res.message);
							return;
						}
						setError(res.message);
						setLoading(false);
						setShow2FA(false);
					} else return redirect('/app/home/');
				}),
			800
		);
	};

	return (
		<LoginTemplate
			background={{
				source: image.source,
				alt: image.alt,
			}}
			contentClassName={styles.main_container}
		>
			<LoginText
				title={'Connexion Agents'}
				description={'Pour accéder à vos services connectez vous avec vos identifiants.'}
			/>

			{show2FA ? (
				<LoginForm
					action={() => setError('Le code de vérification est incomplet.')}
					inputs={<TwoFactorAuthentificationInput submit={totpLogin} disable={loading} />}
					submitText={loading ? 'Vérification...' : 'Valider'}
					submitDisabled={loading}
					loading={loading}
					error={error}
				/>
			) : (
				<LoginForm
					inputs={
						<>
							<LoginTextInput
								type={'mail'}
								icon={<User2 />}
								nameLabel={'Adresse e-mail'}
								placeholder={'michel.doe@bde.42angouleme.fr'}
								name="mail"
								value={mail}
								onChange={(e) => {
									setMail(e.target.value);
								}}
							/>
							<LoginTextInput
								type={'password'}
								icon={<KeyRound />}
								nameLabel={'Mot de passe'}
								placeholder={'••••••••••••'}
								name="password"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
							/>
						</>
					}
					sublinks={
						<Sublinks
							links={[
								{ text: 'Mots de passe oublié ?', href: '/app/login/agents/forgot-password' },
								{ text: 'Crée un nouveau compte.', href: '/app/login/agents/signup' },
								{ text: 'Tu es étudiants ? C’est par ici.', href: '/app/login' },
							]}
						/>
					}
					error={error}
					submitText={'Connexion'}
					submitDisabled={loading}
					loading={loading}
					action={login}
				/>
			)}
		</LoginTemplate>
	);
}
