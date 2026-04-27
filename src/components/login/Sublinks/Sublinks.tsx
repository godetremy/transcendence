import './components.scss';
import Link from 'next/link';

export interface SublinksProps {
	links: Array<{
		text: string;
		href: string;
	}>;
}

export function Sublinks(props: SublinksProps) {
	return (
		<div className={'sublinks'}>
			{props.links.map((link, index) => (
				<Link href={link.href} key={index}>
					{link.text}
				</Link>
			))}
		</div>
	);
}
