import { User2 } from 'lucide-react';
import './components.scss';
import { JSX } from 'react';

interface Inputconfig {
	icon: JSX.Element;
	nameLabel: string;
	inside?: string; // ? signifie optionnel
}

export function InputTemplate(config: Inputconfig): JSX.Element {
	return (
		<div>
			<label htmlFor="name">{config.nameLabel}</label>
			<div className={'userInput'}>
				{config.icon || <User2 />}
				<input type={'type'} placeholder={config.inside} />
			</div>
		</div>
	);
}
