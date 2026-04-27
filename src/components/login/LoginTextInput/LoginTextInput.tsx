import './components.scss';
import { DetailedHTMLProps, InputHTMLAttributes, JSX } from 'react';

export interface LoginTextInputProps extends DetailedHTMLProps<
	InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> {
	icon: JSX.Element;
	nameLabel: string;
}

export function LoginTextInput(props: LoginTextInputProps): JSX.Element {
	return (
		<>
			<label htmlFor="name">{props.nameLabel}</label>
			<div className={'userInput'}>
				{props.icon}
				<input {...props} />
			</div>
		</>
	);
}
