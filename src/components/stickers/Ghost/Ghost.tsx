import styles from './component.module.scss';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import animation from './animation.json';
import { useRef, useEffect } from 'react';

export default function Ghost({ size }: { size?: number }) {
	const lottie = useRef<LottieRefCurrentProps | null>(null);

	const buttonRef = useRef<HTMLButtonElement>(null);
	const canMove = useRef(false);
	const basePos = useRef([0, 0]);

	const resetPosition = () => {
		if (!canMove.current || !buttonRef.current) return;
		canMove.current = false;
		buttonRef.current.style.transition = '.2s cubic-bezier(0,.2,0,1.4)';
		buttonRef.current.style.transform = '';
		lottie.current?.playSegments([100, 500], true);
		setTimeout(() => {
			buttonRef.current!.style.transition = '';
		}, 100);
	};

	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			if (!canMove.current || !buttonRef.current) return;

			buttonRef.current.style.transform = `translate(${(e.clientX - basePos.current[0]) * 0.3}px, ${(e.clientY - basePos.current[1]) * 0.3}px)`;

			if (e.buttons !== 1) resetPosition();
		};
		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', resetPosition);

		return () => {
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseup', resetPosition);
		};
	}, []);

	return (
		<button
			ref={buttonRef}
			className={styles.stickers_container}
			onMouseDown={(e) => {
				basePos.current = [e.clientX, e.clientY];
				canMove.current = true;
			}}
			onMouseUp={resetPosition}
		>
			<Lottie
				lottieRef={lottie}
				animationData={animation}
				loop={false}
				autoplay={true}
				initialSegment={[0, 100]}
				style={{
					width: size ?? 130,
					height: size ?? 130,
				}}
			/>
		</button>
	);
}
