import styles from './layout.module.scss';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
	return <div className={styles.main_container}>{children}</div>;
}
