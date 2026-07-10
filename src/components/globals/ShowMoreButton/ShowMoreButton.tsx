import styles from './component.module.scss';
import { Loader } from '@/components/globals/Loader/Loader';

export interface ShowMoreButtonProps {
	text?: string;
	loading?: boolean;
	loadingText?: string;
	onClick?: () => void;
	className?: string;
}

export function ShowMoreButton(props: ShowMoreButtonProps) {
	return (
		<button
			onClick={props.onClick}
			className={`${styles.show_more_button} ${props.className ?? ''}`}
			disabled={props.loading}
		>
			{props.loading && <Loader size={20} />}
			{props.loading ? (props.loadingText ?? 'Chargement...') : (props.text ?? 'Voir plus')}
		</button>
	);
}
