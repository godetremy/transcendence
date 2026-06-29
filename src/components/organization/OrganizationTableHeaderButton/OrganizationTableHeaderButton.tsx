'use client';
import styles from './component.module.scss';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { LucideProps } from 'lucide-react';

interface OrganizationTableHeaderButtonProps {
	icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
	text: string;
	primary?: boolean;
}

export default function OrganizationTableHeaderButton(props: OrganizationTableHeaderButtonProps) {
	return (
		<button className={`${styles.button} ${props.primary ? styles.primary : ''}`}>
			<props.icon size={20} />
			{props.text}
		</button>
	);
}
