import styles from './component.module.scss';
import { ComponentPropsWithoutRef } from 'react';
import Image from 'next/image';

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

export function CarouselSlide({
	slideImage,
	slideTitle,
	slideDescription,
	slideTag,
	progression,
	...props
}: CarouselSlideProps) {
	return (
		<div
			{...props}
			aria-atomic={false}
			aria-live={'off'}
			className={styles.slide}
			style={{
				opacity: Math.max(progression, 0.5),
				...props.style,
			}}
		>
			<Image src={slideImage} alt={slideTitle} style={{ scale: 1.2 - progression * 0.2 }} fill />
			<button
				className={styles.content}
				style={{
					backdropFilter: `blur(${2 - progression * 2}px) saturate(0%) brightness(0.7)`,
				}}
				onClick={() => console.log(slideTitle)}
			>
				<span
					style={{
						clipPath: `inset(0 ${100 - progression * 100}% 0 0)`,
						backgroundColor: `var(--color-primary-${slideTag.color}`,
					}}
				>
					{slideTag.text}
				</span>
				<h3
					style={{
						opacity: progression,
						transform: `translateX(${50 - progression * 50}px)`,
					}}
				>
					{slideTitle}
				</h3>
				<p
					style={{
						opacity: progression,
						transform: `translateX(${100 - progression * 100}px)`,
					}}
				>
					{slideDescription}
				</p>
			</button>
		</div>
	);
}
