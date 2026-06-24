import styles from './component.module.scss';
import { ReactNode } from 'react';

export interface ListContainerProps {
	children: ReactNode;
}

function ListContainer({ children }: ListContainerProps) {
	return <section className={styles.list}>{children}</section>;
}

export default ListContainer;
