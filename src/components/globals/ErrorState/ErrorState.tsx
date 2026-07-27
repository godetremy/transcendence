import styles from './component.module.scss';
import { JSX } from 'react';
import Image from 'next/image';

export interface ErrorStateProps {
	error?: Error | null;
}

export function ErrorState(props: ErrorStateProps): JSX.Element {
	return (
		<div className={styles.empty_state_container}>
			<Image src={'/images/failure.svg'} alt={'Image de croix sous forme de stickers'} width={100} height={100} />
			<h3>Oups ! Une erreur c&#39;est produite</h3>
			<p>
				{props.error
					? props.error.message
					: 'Aucun détail à propos de cette erreur... Celle-ci doit-être vraiment étrange...!'}
			</p>
		</div>
	);
}
