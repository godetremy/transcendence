'use client';
import './page.module.scss';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { StaffLoginPagesImages } from '@/const/StaffLoginPagesImages';
import { useState } from 'react';
import { User2 } from 'lucide-react';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { LoginText } from '@/components/login/LoginText/LoginText';
import styles from '@/app/app/login/agents/forgot-password/[token]/page.module.scss';
import { LoginForm } from '@/components/login/LoginForm/LoginForm';

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
			contentClassName={styles.main_container}
		>
			<LoginText
				title={"Verification d'identite"}
				description={
					'Pour réinitialiser votre mot de passe, veuillez fournir votre addresse e-mail de connexion.'
				}
			/>

			<LoginForm
				action={() => {}}
				inputs={
					<LoginTextInput
						type={'mail'}
						icon={<User2 />}
						nameLabel={'Adresse e-mail'}
						placeholder={'michel.doe@bde.42angouleme.fr'}
					/>
				}
				submitText={'Réinitialiser mon mot de passe'}
			/>
		</LoginTemplate>
	);
}
