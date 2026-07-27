import styles from './component.module.scss';
import { JSX } from 'react';
import Image from 'next/image';

export interface OrganizationBannerProps {
	logo: string;
	name: string;
	description: string;
}

export function OrganizationBanner(props: OrganizationBannerProps): JSX.Element {
	return (
		<header style={{ backgroundImage: `url(${props.logo})` }} className={styles.header}>
			<div className={styles.overlay} />

			<div className={styles.content}>
				<Image src={props.logo} alt={`${props.name} logo`} width={150} height={150} />

				<h1>{props.name}</h1>
				<p>{props.description}</p>
			</div>
		</header>
	);
}
