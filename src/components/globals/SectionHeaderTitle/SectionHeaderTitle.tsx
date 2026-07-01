'use client';

import styles from './components.module.scss';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SectionTitle {
	title: string;
	href?: string;
}

export default function SectionHeaderTitle({ title, href }: SectionTitle) {
	const router = useRouter();

	return (
		<div className={styles.title}>
			<h2>{title}</h2>
			<button
				onClick={() => {
					if (href) router.push(href);
				}}
			>
				Voir plus
				<ArrowRight size={16} />
			</button>
		</div>
	);
}
