import styles from './component.module.scss';
import { DetailedHTMLProps, InputHTMLAttributes, JSX } from 'react';

export interface LoginTextInputProps extends DetailedHTMLProps<
	InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> {
	icon?: JSX.Element;
	nameLabel: string;
	useTextArea?: boolean;
}

export function LoginTextInput({ nameLabel, icon, useTextArea, ...props }: LoginTextInputProps): JSX.Element {
	return (
		<div className={styles.input_container}>
			<label htmlFor="name" className={styles.label}>
				{nameLabel}
				{props.required && <span>*</span>}
			</label>
			{useTextArea ? (
				<textarea
					className={styles.textArea}
					rows={5}
					{...(props as DetailedHTMLProps<InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>)}
				/>
			) : (
				<div className={styles.userInput}>
					{icon}
					<input {...props} />
				</div>
			)}
		</div>
	);
}
