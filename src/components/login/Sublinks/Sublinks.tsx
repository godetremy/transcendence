import styles from './component.module.scss';

export interface SublinksProps {
	links: Array<{
		text: string;
		href?: string;
		onClick?: () => void;
	}>;
}

export function Sublinks(props: SublinksProps) {
	return (
		<div className={styles.sublinks}>
			{props.links.map((link, index) => (
				<a href={link.href} onClick={link.onClick} key={index}>
					{link.text}
				</a>
			))}
		</div>
	);
}
