import './components.scss';
import Link from 'next/link';

export interface SublinksProps {
	links: Array<{
		text: string;
		href?: string;
		onClick?: () => void;
	}>;
}

export function Sublinks(props: SublinksProps) {
	return (
		<div className={'sublinks'}>
			{props.links.map((link, index) => (
				<a href={link.href} onClick={link.onClick} key={index}>
					{link.text}
				</a>
			))}
		</div>
	);
}
