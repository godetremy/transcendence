'use client';
import styles from './page.module.scss';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { StaffLoginPagesImages } from '@/const/StaffLoginPagesImages';
import { useState } from 'react';
import { KeyRound, User2 } from 'lucide-react';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { Sublinks } from '@/components/login/Sublinks/Sublinks';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { SignupFormSchema } from '@/schema/SignupSchema';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/login/LoginForm/LoginForm';
import { useMutation } from '@tanstack/react-query';
import { signupAgent } from '@/lib/fetcher/user';
import { useToast, ToastType } from '@/components/globals/ToastProvider/ToastProvider';

export default function Page() {
	const [error, setError] = useState<string | undefined>(undefined);
	const [image] = useState(() => {
		return StaffLoginPagesImages[Math.floor(Math.random() * StaffLoginPagesImages.length)];
	});

	const { mutateAsync } = useMutation(signupAgent());
	const toast = useToast();

	const signUp = async (form: FormData) => {
		const fields = SignupFormSchema.safeParse({
			mail: form.get('mail'),
			password: form.get('password'),
			passwordCheck: form.get('passwordCheck'),
		});

		if (!fields.success) {
			setError(fields.error.issues[0].message);
			return;
		}

		try {
			const check = await mutateAsync({ body: fields.data });

			if (!check.success) {
				throw new Error("L'inscription a échoué");
			}

			toast.showToast({
				title: 'Succès',
				message: 'Votre compte a été créé avec succès.',
				type: ToastType.SUCCESS,
			});

			return redirect('/app/home/');
		} catch (error) {
			console.error("Erreur lors de l'inscription :", error);

			toast.showToast({
				title: 'Erreur',
				message: 'Impossible de créer votre compte.',
				type: ToastType.ERROR,
			});
		}
	};

	return (
		<LoginTemplate
			background={{
				source: image.source,
				alt: image.alt,
			}}
			contentClassName={styles.main_container}
		>
			<LoginText title={'Cree un compte'} description={'Pour accéder à vos services inscrivez vous.'} />

			<LoginForm
				action={signUp}
				inputs={
					<>
						<LoginTextInput
							name={'mail'}
							type={'mail'}
							icon={<User2 />}
							nameLabel={'Adresse e-mail'}
							placeholder={'michel.doe@bde.42angouleme.fr'}
						/>
						<LoginTextInput
							name={'password'}
							type={'password'}
							icon={<KeyRound />}
							nameLabel={'Mot de passe'}
							placeholder={'••••••••••••'}
						/>
						<LoginTextInput
							name={'passwordCheck'}
							type={'password'}
							icon={<KeyRound />}
							nameLabel={'Confirmation du mot de passe'}
							placeholder={'••••••••••••'}
						/>
					</>
				}
				sublinks={
					<Sublinks
						links={[
							{ text: "J'ai déjà un compte.", href: '/app/login/agents' },
							{ text: 'Tu es étudiants ? C’est par ici.', href: '/app/login' },
						]}
					/>
				}
				submitText={'Crée un compte'}
				error={error}
			/>
		</LoginTemplate>
	);
}
