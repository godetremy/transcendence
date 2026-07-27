import styles from './component.module.scss';
import { Eyes } from '@/components/stickers/Eyes/Eyes';
import { ReactNode } from 'react';

export interface LoginTextProps {
	stickers?: ReactNode;
	title: string;
	description: string;
}

export function LoginText(props: LoginTextProps) {
	return (
		<div className={styles.titles}>
			{props.stickers ? props.stickers : <Eyes className={styles.stickers} />}

			<div className={styles.text}>
				<h1>{props.title}</h1>
				<p>{props.description}</p>
			</div>
		</div>
	);
}
