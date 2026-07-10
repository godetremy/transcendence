'use client';
import styles from './component.module.scss';
import { CSSProperties, useEffect, useRef, useState } from 'react';

export interface OrganizationDashboardHeaderProps {
	title: string;
	menu: Array<{ text: string; onPress?: () => void }>;
	selected?: number;
	onSelectChange?: (index: number) => void;
}

export function OrganizationDashboardHeader(props: OrganizationDashboardHeaderProps) {
	const [internalSelected, setInternalSelected] = useState<number>(0);
	const [width, setWidth] = useState(0);
	const [left, setLeft] = useState(20);

	const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

	useEffect(() => {
		if (buttonsRef.current[0]) {
			setWidth(buttonsRef.current[0].getBoundingClientRect().width);
		}
	}, []);

	return (
		<header className={styles.header}>
			<h1>{props.title}</h1>
			<nav
				style={
					{
						'--line-width': `${width}px`,
						'--line-left': `${left}px`,
					} as CSSProperties
				}
			>
				{props.menu.map((item, i) => (
					<button
						key={i}
						ref={(ref) => {
							buttonsRef.current[i] = ref;
						}}
						id={`org_dashboard_item_${i}`}
						onClick={(event) => {
							if (props.onSelectChange) {
								props.onSelectChange(i);
							}
							setInternalSelected(i);
							const rect = event.currentTarget.getBoundingClientRect();
							let left = 20;
							for (let j = 0; j < i; j++) {
								left += (buttonsRef.current[j]?.getBoundingClientRect().width ?? 0) + 20;
							}
							setWidth(rect.width);
							setLeft(left);
							if (item.onPress) item.onPress();
						}}
						className={internalSelected === i ? styles.selected : undefined}
					>
						{item.text}
					</button>
				))}
			</nav>
		</header>
	);
}
