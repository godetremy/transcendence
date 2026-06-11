import './component.scss';
import { DetailedHTMLProps, InputHTMLAttributes, JSX } from 'react';

export interface LoginTextInputProps extends DetailedHTMLProps<
	InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> {
	icon: JSX.Element;
	nameLabel: string;
}

export function LoginTextInput({ nameLabel, icon, ...props }: LoginTextInputProps): JSX.Element {
	return (
		<>
			<label htmlFor="name">{nameLabel}</label>
			<div className={'userInput'}>
				{icon}
				<input {...props} />
			</div>
		</>
	);
}
