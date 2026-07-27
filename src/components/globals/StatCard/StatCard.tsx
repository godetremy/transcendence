import styles from './component.module.scss';
import { ArrowDown, ArrowUp } from 'lucide-react';

export interface StatCardProps {
	title: string;
	value: number;
	isPercentage?: boolean;
	progression: number;
}

export function StatCard(props: StatCardProps) {
	return (
		<div className={styles.card}>
			<div className={styles.value_container}>
				<span>{props.title}</span>
				<p>{props.value + (props.isPercentage ? '%' : '')}</p>
			</div>
			<div className={styles.progression_container}>
				{props.progression > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
				<span>
					{`${Math.abs(props.progression)}${props.isPercentage ? '%' : ' nouveaux '} depuis le dernier mois`}
				</span>
			</div>
		</div>
	);
}
