import styles from './component.module.scss';
import { ForwardRefExoticComponent, ReactNode, RefAttributes, useEffect, useState } from 'react';
import { AnimatePresence, motion, TargetAndTransition } from 'motion/react';
import { Ellipsis, LucideProps } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface MenuButtonProps {
	containerKey: string | number;
	children?: ReactNode;
	alignRight?: boolean;
	className?: string;
	menu: Array<{
		icon?: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
		negative?: boolean;
		title: string;
		onClick?: () => void;
	}>;
}

export function MenuButton({ menu, alignRight, children, containerKey, className }: MenuButtonProps) {
	const [visibleMenu, setVisibleMenu] = useState(false);

	const closedContainer: TargetAndTransition = {
		opacity: 0,
		scale: 0.9,
		translateY: '-10%',
		rotateY: 50,
		transition: { type: 'spring', stiffness: 600, damping: 30 },
	};
	const openedContainer: TargetAndTransition = {
		opacity: 1,
		scale: 1,
		translateY: '0%',
		rotateY: 0,
		transition: { type: 'spring', stiffness: 600, damping: 30 },
	};

	useEffect(() => {
		const onScroll = () => setVisibleMenu(false);
		document.addEventListener('scroll', onScroll);

		return () => document.removeEventListener('scroll', onScroll);
	});

	return (
		<>
			<button
				onClick={() => {
					setVisibleMenu(!visibleMenu);
				}}
				className={
					children
						? undefined
						: `${styles.menu_button} ${visibleMenu && styles.active} ${className ? className : ''}`
				}
				style={{ anchorName: `--menu_button-${containerKey}` }}
			>
				{children ? children : <Ellipsis strokeWidth={1.8} />}
			</button>
			{createPortal(
				<AnimatePresence>
					{visibleMenu && (
						<>
							<motion.div
								className={styles.menu_overlay}
								onClick={() => setVisibleMenu(false)}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0, pointerEvents: 'none' }}
							/>

							<motion.div
								className={styles.menu_container}
								key="container"
								initial={closedContainer}
								animate={openedContainer}
								exit={closedContainer}
								style={{
									positionAnchor: `--menu_button-${containerKey}`,
									positionArea: alignRight ? 'bottom span-left' : 'bottom span-right',
								}}
							>
								{menu.map((item, index) => (
									<button
										key={index}
										onClick={() => {
											setVisibleMenu(false);
											item.onClick?.();
										}}
										className={item.negative ? styles.negative : undefined}
									>
										<div className={styles.icon}>
											{item.icon && <item.icon size={18} color={'currentColor'} />}
										</div>

										<span>{item.title}</span>
									</button>
								))}
							</motion.div>
						</>
					)}
				</AnimatePresence>,
				document.body
			)}
		</>
	);
}
