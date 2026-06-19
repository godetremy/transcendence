import styles from './component.module.scss';
import Ghost from '@/components/stickers/Ghost/Ghost';
import { JSX } from 'react';

export interface EmptyStateProps {
	title?: string;
	description?: string;
}

export function EmptyState(props: EmptyStateProps): JSX.Element {
	return (
		<div className={styles.empty_state_container}>
			<Ghost />
			<h3>{props.title ?? 'Rien à voir ici...'}</h3>
			<p>{props.description ?? "Aucun contenu n'est disponible pour le moment. Reviens plus tard."}</p>
		</div>
	);
}
