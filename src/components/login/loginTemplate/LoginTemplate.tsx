import styles from './component.module.scss';
import Image from 'next/image';
import { JSX } from 'react';

export interface LoginTemplateProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
	background: { source: string; alt: string };
}

export function LoginTemplate(props: LoginTemplateProps): JSX.Element {
	return (
		<main className={styles.main}>
			<section className={styles.content} {...props}>
				{props.children}
			</section>
			<section className={styles.background}>
				<Image
					src={props.background.source}
					alt={props.background.alt}
					className={styles.background_img}
					fill
				/>
			</section>
		</main>
	);
}
