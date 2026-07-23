import styles from './component.module.scss';
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

function ListContainer({ children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
	return (
		<section {...props} className={props.className ?? styles.list}>
			{children}
		</section>
	);
}

export default ListContainer;
