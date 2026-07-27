import styles from './component.module.scss';
import { ReactNode } from 'react';
import { Loader } from '@/components/globals/Loader/Loader';

export interface LoginFormProps {
	action: (formData: FormData) => void | Promise<void>;
	inputs: ReactNode;
	sublinks?: ReactNode;
	error?: string;
	submitText: string;
	loading?: boolean;
	submitDisabled?: boolean;
}

export function LoginForm(props: LoginFormProps) {
	return (
		<form action={props.action} className={styles.form_container}>
			<div className={styles.inputs}>{props.inputs}</div>

			{props.error && <p className={styles.error}>{props.error}</p>}

			{props.sublinks}

			<button type={'submit'} disabled={props.submitDisabled ?? false}>
				{props.loading && <Loader size={30} />}
				{props.submitText}
			</button>
		</form>
	);
}
