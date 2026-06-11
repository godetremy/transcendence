'use client';
import styles from './components.module.scss';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface NavigationBarHeaderProps {
	title: string;
	children?: React.ReactNode;
}

export function NavigationBarHeader(props: NavigationBarHeaderProps) {
	const [titleProgression, setTitleProgression] = useState(0);
	const router = useRouter();

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
			<header
				style={{
					borderColor: `rgba(var(--color-rgb-primary-white), ${Math.min(titleProgression * 0.7, 0.1)})`,
				}}
			>
				<div className={styles.headerContainer}>
					<button onClick={() => router.back()}>
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
