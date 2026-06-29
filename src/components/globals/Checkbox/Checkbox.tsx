import styles from './component.module.scss';
import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export function Checkbox(props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
	return <input type={'checkbox'} className={styles.checkbox} {...props} />;
}
