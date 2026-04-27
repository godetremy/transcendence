import './component.scss';
import { Eyes } from '@/components/stickers/eyes/Eyes';

export interface LoginTextProps {
	title: string;
	description: string;
}

export function LoginText(props: LoginTextProps) {
	return (
		<div className={'titles'}>
			<Eyes className={'stickers'} />

			<div className={'text'}>
				<h1>{props.title}</h1>
				<p>{props.description}</p>
			</div>
		</div>
	);
}