import styles from './component.module.scss';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { ChevronRight, LucideProps } from 'lucide-react';

export interface ListItemProps {
	icon?: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
	title: string;
	description?: string;
	showChevron?: boolean;
	last?: boolean;
	negative?: boolean;
	onPress?: () => void;
	rightElement?: React.ReactNode;
}

function ListItem({
	icon: Icon,
	title,
	description,
	showChevron = true,
	last = false,
	negative = false,
	onPress,
	rightElement,
}: ListItemProps) {
	return (
		<button
			className={`${styles.listItem} ${negative ? styles.negative : ''}`}
			style={{
				height: description ? '60px' : '50px',
				borderBottom: last ? 'none' : '1px solid var(--color-border-dark)',
			}}
			onClick={onPress}
		>
			{Icon && (
				<div className={styles.left}>
					<Icon width={24} height={24} color={'currentColor'} />
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
