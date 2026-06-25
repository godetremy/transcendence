import styles from './components.module.scss';
import { Check, X } from 'lucide-react';
import { Loader } from '@/components/globals/Loader/Loader';

export interface CardHeaderProps {
	title: string;
	onClose: () => void;
	onAccept?: () => void;
	loading?: boolean;
	disabledAccept?: boolean;
}

export function CardHeader(props: CardHeaderProps) {
	return (
		<header className={styles.card_header}>
			{props.onAccept !== undefined && (
				<button onClick={props.onClose} disabled={props.loading}>
					<X />
				</button>
			)}

			<h1>{props.title}</h1>
			{props.onAccept !== undefined && (
				<button
					className={styles.primary}
					onClick={props.onAccept}
					disabled={props.loading || props.disabledAccept}
				>
					{props.loading ? <Loader size={24} /> : <Check />}
				</button>
			)}

			{props.onAccept === undefined && (
				<button onClick={props.onClose} disabled={props.loading}>
					<X />
				</button>
			)}
		</header>
	);
}
