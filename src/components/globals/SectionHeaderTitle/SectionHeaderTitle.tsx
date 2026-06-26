'use client';

import styles from './components.module.scss';
import { ArrowRight } from 'lucide-react';

interface SectionTitle {
	title: string;
}

export default function SectionHeaderTitle({ title }: SectionTitle) {
	return (
		<div className={styles.title}>
			<h2>{title}</h2>
			<button>
				Voir plus
				<ArrowRight size={16} />
			</button>
		</div>
	);
}
