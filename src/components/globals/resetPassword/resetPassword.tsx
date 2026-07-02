'use client';
import styles from './components.module.scss';
import { Eyes } from '@/components/stickers/Eyes/Eyes';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { KeyRound } from 'lucide-react';

export function ResetPassword() {
	return (
		<div className={styles.page}>
			<Eyes className={styles.stickers} width={100} />
			<h1 className={styles.h1}>Changer mon mot de passe</h1>
			<div className={styles.inputPassword}>
				<LoginTextInput
					name={'password'}
					type={'password'}
					icon={<KeyRound />}
					nameLabel={'Mot de passe actuel'}
					placeholder={'••••••••••••'}
				/>
				<LoginTextInput
					name={'password'}
					type={'password'}
					icon={<KeyRound />}
					nameLabel={'Nouveau mot de passe'}
					placeholder={'••••••••••••'}
				/>
				<LoginTextInput
					name={'password'}
					type={'password'}
					icon={<KeyRound />}
					nameLabel={'Confirmation du nouveau mot de passe'}
					placeholder={'••••••••••••'}
				/>
			</div>
			<button className={styles.button} type="button">
				Confirmer
			</button>
		</div>
	);
}
