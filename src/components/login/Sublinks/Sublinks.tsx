import './components.scss';

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
				<a href={link.href} key={index}>
					{link.text}
				</a>
			))}
		</div>
	);
}
