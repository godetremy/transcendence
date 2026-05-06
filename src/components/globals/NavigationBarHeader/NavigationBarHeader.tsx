'use client';
import styles from './components.module.scss';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface NavigationBarHeaderProps {
	title: string;
	children?: React.ReactNode;
}

export function NavigationBarHeader(props: NavigationBarHeaderProps) {
	const [titleProgression, setTitleProgression] = useState(0);

	useEffect(() => {
		const onScroll = () => {
			const scrollY = Math.min((window.scrollY - 20) / 50, 1);
			setTitleProgression(scrollY);
		};

		window.addEventListener('scroll', onScroll);

		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<div className={styles.scrollContainer}>
			<header>
				<div className={styles.headerContainer}>
					<button>
						<ChevronLeft color={'currentColor'} size={24} />
					</button>
					<p
						style={{
							transform: `translateY(${10 - titleProgression * 10}px)`,
							opacity: titleProgression,
						}}
					>
						{props.title}
					</p>
				</div>
			</header>
			{props.children}
		</div>
	);
}
