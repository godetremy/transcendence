import styles from './component.module.scss';
import Image from 'next/image';
import React, { JSX } from 'react';

export interface LoginTemplateProps {
	background: { source: string; alt: string };
	contentClassName?: string;
	children: React.ReactNode;
}

export function LoginTemplate(props: LoginTemplateProps): JSX.Element {
	return (
		<main className={styles.main_container}>
			<section className={`${styles.content} ${props.contentClassName ?? ''}`}>{props.children}</section>
			<section className={styles.background}>
				<Image
					src={props.background.source}
					alt={props.background.alt}
					className={styles.background_img}
					fill
					loading="eager"
				/>
			</section>
		</main>
	);
}
