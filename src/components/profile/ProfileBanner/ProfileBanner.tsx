import styles from './component.module.scss';
import { JSX } from 'react';

export interface ProfileBannerProps {
	image: string;
	name: string;
	mail: string;
	subscribed: boolean;
}

export function ProfileBanner(props: ProfileBannerProps): JSX.Element {
	return (
		<header style={{ backgroundImage: `url(${props.image})` }} className={styles.header}>
			<div className={styles.overlay} />

			<div className={styles.content}>
				<img src={props.image} alt={`Image de ${props.name}`} />

				<h1>{props.name}</h1>
				<p>{props.mail}</p>
			</div>
		</header>
	);
}