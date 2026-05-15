import styles from './component.module.scss';
import { ComponentPropsWithoutRef } from 'react';

export interface SlideProps {
	slideImage: string;
	slideTitle: string;
	slideDescription: string;
	slideTag: {
		text: string;
		color: string;
	};
}

export interface CarouselSlideProps extends SlideProps, ComponentPropsWithoutRef<'div'> {
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
				backgroundImage: `url(${props.slideImage})`,
				backgroundSize: `${120 - props.progression * 20}%`,
				opacity: Math.max(props.progression, 0.5),
				...props.style,
			}}
		>
			<div
				className={styles.content}
				style={{
					backdropFilter: `blur(${2 - props.progression * 2}px) saturate(0%) brightness(0.7)`,
				}}
			>
				<span
					style={{
						clipPath: `inset(0 ${100 - props.progression * 100}% 0 0)`,
						backgroundColor: `var(--color-primary-${props.slideTag.color}`,
					}}
				>
					{props.slideTag.text}
				</span>
				<h3
					style={{
						opacity: props.progression,
						transform: `translateX(${50 - props.progression * 50}px)`,
					}}
				>
					{props.slideTitle}
				</h3>
				<p
					style={{
						opacity: props.progression,
						transform: `translateX(${100 - props.progression * 100}px)`,
					}}
				>
					{props.slideDescription}
				</p>
			</div>
		</div>
	);
}
