'use client';

import styles from './component.module.scss';
import { ReactNode } from 'react';

interface CustomButton {
	icon: ReactNode;
	text: string;
}

export default function OrganizationTableHeaderButton({ icon, text }: CustomButton) {
	return (
		<button className={styles.button}>
			{icon}
			{text}
		</button>
	);
}
