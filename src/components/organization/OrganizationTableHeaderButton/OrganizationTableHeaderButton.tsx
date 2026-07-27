'use client';
import styles from './component.module.scss';
import { ButtonHTMLAttributes, DetailedHTMLProps, ForwardRefExoticComponent, RefAttributes } from 'react';
import { LucideProps } from 'lucide-react';

interface OrganizationTableHeaderButtonProps extends DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> {
	icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
	text: string;
	primary?: boolean;
}

export default function OrganizationTableHeaderButton({
	icon,
	text,
	primary,
	...props
}: OrganizationTableHeaderButtonProps) {
	const Icon = icon;

	return (
		<button className={`${styles.button} ${primary ? styles.primary : ''}`} {...props}>
			<Icon size={20} />
			<span>{text}</span>
		</button>
	);
}
