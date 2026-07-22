'use client';
import styles from './components.module.scss';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { KeyRound } from 'lucide-react';
import { CardHeader } from '@/components/globals/CardHeader/CardHeader';
import { useState } from 'react';
import { Loader } from '@/components/globals/Loader/Loader';

export interface ResetPasswordProps {
	onClose: () => void;
	onAccept?: () => void;
	loading?: boolean;
	disabledAccept?: boolean;
}

export function ResetPassword({ onClose, onAccept, loading, disabledAccept }: ResetPasswordProps) {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	return (
		<section className={styles.main_container}>
			<CardHeader title={'Changer mon mot de passe'} onClose={onClose} />
			<div className={styles.inputPassword}>
				<LoginTextInput
					name={'password'}
					type={'password'}
					icon={<KeyRound />}
					nameLabel={'Mot de passe actuel'}
					placeholder={'••••••••••••'}
					value={currentPassword}
					onChange={(e) => setCurrentPassword(e.target.value)}
				/>
				<LoginTextInput
					name={'password'}
					type={'password'}
					icon={<KeyRound />}
					nameLabel={'Nouveau mot de passe'}
					placeholder={'••••••••••••'}
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
				/>
				<LoginTextInput
					name={'password'}
					type={'password'}
					icon={<KeyRound />}
					nameLabel={'Confirmation du nouveau mot de passe'}
					placeholder={'••••••••••••'}
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
			</div>
			<button
				className={styles.button}
				type="button"
				onClick={onAccept}
				disabled={(loading ?? false) || (disabledAccept ?? false)}
			>
				{loading && <Loader size={24} />}
				{loading ? 'Modification en cours...' : 'Changer le mot de passe'}
			</button>
		</section>
	);
}
