import styles from './component.module.scss';
import { Eyes } from '@/components/stickers/eyes/Eyes';

export interface LoginTextProps {
	title: string;
	description: string;
}

export function LoginText(props: LoginTextProps) {
	return (
		<div className={styles.titles}>
			<Eyes className={styles.stickers} />

			<div className={styles.text}>
				<h1>{props.title}</h1>
				<p>{props.description}</p>
			</div>
		</div>
	);
}
