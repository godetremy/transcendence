import styles from './component.module.scss';

export function ListSectionTitle({ children }: { children: string }) {
	return <span className={styles.listSectionTitle}>{children}</span>;
}
