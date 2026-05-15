import styles from './component.module.scss';
import { ComponentPropsWithoutRef } from 'react';

export interface CarouselSlideProps extends ComponentPropsWithoutRef<'div'> {
	title: string;
	progression: number;
}

export function CarouselSlide(props: CarouselSlideProps) {
	return (
		<div
			{...props}
			aria-atomic={false}
			aria-live={'off'}
			className={styles.slide}
			style={{
				opacity: Math.max(props.progression, 0.5),
				...props.style,
			}}
		>
			<div
				className={styles.content}
				style={{
					transform: `translateX(-${100 - props.progression * 100}px) scale(${1.3 - props.progression * 0.3})`,
					filter: `blur(${5 - props.progression * 5}px)`,
				}}
			>
				<img src={'/images/demo_profile.jpg'} alt={''} className={styles.backgroundImage} />
				<h3>{props.title}</h3>
			</div>
		</div>
	);
}
