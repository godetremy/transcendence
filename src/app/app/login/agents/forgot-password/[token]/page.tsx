'use client';
import styles from './page.module.scss';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { StaffLoginPagesImages } from '@/const/StaffLoginPagesImages';
import { useEffect, useState } from 'react';
import { KeyRound, Loader } from 'lucide-react';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { LoginForm } from '@/components/login/LoginForm/LoginForm';
import { useParams } from 'next/navigation';
import { get, put } from '@/lib/fetcher';
import { PasswordSchema } from '@/schema/PasswordSchema';

export default function Page() {
	const [image] = useState(() => {
		return StaffLoginPagesImages[Math.floor(Math.random() * StaffLoginPagesImages.length)];
	});

	const [isTokenValid, setIsTokenValid] = useState<boolean | undefined>(undefined);
	const [isUpdated, setIsUpdated] = useState<boolean | undefined>(false);
	const [error, setError] = useState<string | undefined>(undefined);
	const params = useParams();

	const updatePassword = async (form: FormData) => {
		const values = {
			password: form.get('password')!,
			passwordCheck: form.get('password_check')!,
		};

		const result = PasswordSchema.safeParse(values.password);
		const identical = values.password === values.passwordCheck;

		if (!result.success) {
			setError(result.error.issues[0].message);
			return;
		}
		if (!identical) {
			setError('Les mots de passes ne correspondent pas.');
			return;
		}

		const res = await put<{ success: boolean; message?: string }>(`/auth/forgot-password/`, {
			token: params.token as string,
			password: values.password,
		});
		if (!res.success) {
			setError(res.message ?? 'Unknown error');
			return;
		} else {
			setIsUpdated(true);
		}
	};

	useEffect(() => {
		(async () =>
			setIsTokenValid(
				(await get<{ success: boolean }>(`/auth/forgot-password?token=${params.token as string}`)).success
			))();
	}, [params.token]);

	return (
		<LoginTemplate
			background={{
				source: image.source,
				alt: image.alt,
			}}
			contentClassName={styles.main_container}
		>
			{isTokenValid === undefined ? (
				<Loader />
			) : (
				<>
					{isUpdated ? (
						<>
							<LoginText
								title={'Tout est bon !'}
								description={
									'Ton mot de passe à était modifié avec succès. Tu peux désormais te connecter avec ce noueau mot de passe.'
								}
							/>
							<a href={'/app/login'} className={styles.link_primary}>
								Se connecter
							</a>
						</>
					) : (
						<>
							{!isTokenValid ? (
								<LoginText
									title={"Ce lien n'est plus valide"}
									description={
										"Pour garantir la sécurité de votre compte, ce lien de réinitialisation n'est plus valide. Vous pouvez en demander un nouveau à tout moment."
									}
								/>
							) : (
								<>
									<LoginText
										title={'Reinitialiser votre mot de passe'}
										description={"Création d'un nouveau mot de passe"}
									/>
									<LoginForm
										action={updatePassword}
										inputs={
											<>
												<LoginTextInput
													name={'password'}
													type={'password'}
													icon={<KeyRound />}
													nameLabel={'Nouveau mot de passe'}
													placeholder={'••••••••••••'}
												/>
												<LoginTextInput
													name={'password_check'}
													type={'password'}
													icon={<KeyRound />}
													nameLabel={'Confirmation du mot de passe'}
													placeholder={'••••••••••••'}
												/>
											</>
										}
										submitText={'Réinitialiser mon mot de passe'}
										error={error}
									/>
								</>
							)}
						</>
					)}
				</>
			)}
		</LoginTemplate>
	);
}
