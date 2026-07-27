import styles from './component.module.scss';
import { ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react';
import { ChevronRight, LucideProps } from 'lucide-react';

export interface ListItemProps {
	icon?: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
	title: string;
	description?: string;
	showChevron?: boolean;
	last?: boolean;
	negative?: boolean;
	hoverEffect?: boolean;
	onPress?: () => void;
	leftElement?: ReactNode;
	rightElement?: ReactNode;
	disabled?: boolean;
}

function ListItem({
	icon: Icon,
	title,
	description,
	showChevron = true,
	last = false,
	negative = false,
	hoverEffect = true,
	onPress,
	leftElement,
	rightElement,
	disabled = false,
}: ListItemProps) {
	return (
		<button
			className={`${styles.listItem} ${hoverEffect ? styles.hoverable : ''} ${negative ? styles.negative : ''}`}
			style={{
				minHeight: description ? '60px' : '50px',
				borderBottom: last ? 'none' : '1px solid var(--color-border-dark)',
			}}
			onClick={onPress}
			disabled={disabled}
		>
			{(leftElement || Icon) && (
				<div className={styles.left}>
					{leftElement && leftElement}
					{Icon && <Icon width={24} height={24} color={'currentColor'} />}
				</div>
			)}
			<div className={styles.main}>
				<p>{title}</p>
				{description && <span>{description}</span>}
			</div>
			<div className={styles.right}>
				{rightElement && <div className={styles.rightElement}>{rightElement}</div>}
				{showChevron && <ChevronRight width={24} height={24} color={'currentColor'} />}
			</div>
		</button>
	);
}

export default ListItem;
