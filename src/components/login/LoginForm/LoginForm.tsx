import styles from './component.module.scss';
import { ReactNode } from 'react';

export interface LoginFormProps {
	action: (formData: FormData) => void | Promise<void>;
	inputs: ReactNode;
	sublinks?: ReactNode;
	error?: string;
	submitText: string;
}

export function LoginForm(props: LoginFormProps) {
	return (
		<form action={props.action} className={styles.form_container}>
			<div className={styles.inputs}>{props.inputs}</div>

			{props.error && <p className={styles.error}>{props.error}</p>}

			{props.sublinks}

			<input type={'submit'} value={props.submitText} />
		</form>
	);
}
