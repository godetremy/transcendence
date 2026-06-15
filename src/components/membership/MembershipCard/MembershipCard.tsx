import { motion, TargetAndTransition } from 'motion/react';
import styles from './component.module.scss';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';
import QRCode from 'react-qr-code';
import { useEffect, useRef } from 'react';

export interface MembershipCardProps {
	requestClose: () => void;
}

export function MembershipCard(props: MembershipCardProps) {
	const user = useUser();
	const overlayRef = useRef<HTMLDivElement | null>(null);

	const openOverlayStateAnimation: TargetAndTransition = { opacity: 1, pointerEvents: 'auto' };
	const closeOverlayStateAnimation: TargetAndTransition = { opacity: 0, pointerEvents: 'none' };

	const openCardStateAnimation: TargetAndTransition = {
		transform: 'translateY(0px) scaleX(1) scaleY(1)',
		filter: 'blur(0px)',
		opacity: 1,
		transition: {
			duration: 0.4,
			ease: [0.5, 0, 0, 1.15],
		},
	};
	const closeCardStateAnimation: TargetAndTransition = {
		transform: 'translateY(300px) scaleX(0.5) scaleY(1.2)',
		filter: 'blur(10px)',
		opacity: 0,
	};

	useEffect(() => {
		let startPosY = 0;
		let lastPosY = 0;

		const getTouchPos = (e: TouchEvent) => e.touches.item(0)?.clientY ?? 0;

		const onTouchStart = (e: TouchEvent) => {
			startPosY = getTouchPos(e);
		};

		const onTouchMove = (e: TouchEvent) => {
			if (!overlayRef.current) return;

			const pos = (startPosY - getTouchPos(e)) * -1;
			if (pos < 0) {
				overlayRef.current.style.transform = `scaleY(${1 - pos / 10000}) translateY(${-(pos / 14)}px)`;
			} else {
				overlayRef.current.style.transform = `translateY(${pos}px)`;
			}
			lastPosY = pos;
		};

		const onTouchEnd = () => {
			if (!overlayRef.current) return;

			if (lastPosY / window.innerHeight > 0.2) props.requestClose();
			else {
				overlayRef.current.style.transition = '.2s';
				overlayRef.current.style.transform = '';
				setTimeout(() => {
					overlayRef.current!.style.transition = '';
				}, 200);
			}
		};

		document.body.style.overflow = 'hidden';
		overlayRef.current?.addEventListener('touchstart', onTouchStart);
		overlayRef.current?.addEventListener('touchmove', onTouchMove);
		overlayRef.current?.addEventListener('touchend', onTouchEnd);

		return () => {
			document.body.style.overflow = '';
			overlayRef.current?.removeEventListener('touchstart', onTouchStart);
			overlayRef.current?.removeEventListener('touchmove', onTouchMove);
			overlayRef.current?.removeEventListener('touchend', onTouchEnd);
		};
	}, []);

	return (
		<motion.div
			ref={overlayRef}
			key={'overlay'}
			animate={openOverlayStateAnimation}
			initial={closeOverlayStateAnimation}
			exit={closeOverlayStateAnimation}
			className={styles.overlay}
			onClick={props.requestClose}
		>
			<motion.div
				key={'card'}
				animate={openCardStateAnimation}
				initial={closeCardStateAnimation}
				exit={closeCardStateAnimation}
				className={styles.card}
			>
				<Image src={user?.profile_picture ?? ''} alt={user?.full_name ?? ''} width={150} height={150} />
				<h1>{user?.full_name}</h1>
				<p>Adhérent pour l&#39;année 2026-2027</p>
				<QRCode value={user?.id ?? 'INVALID'} size={240} />
			</motion.div>
		</motion.div>
	);
}
