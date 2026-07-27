import styles from './component.module.scss';
import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export function Toggle(props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
	return <input className={styles.toggle} type={'checkbox'} {...props} />;
}
