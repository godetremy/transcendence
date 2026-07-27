import styles from './component.module.scss';
import { JSX } from 'react';
import Image from 'next/image';

export function WipState(): JSX.Element {
	return (
		<div className={styles.empty_state_container}>
			<Image src={'/images/cone.svg'} alt={'Image de cone sous forme de stickers'} width={100} height={100} />
			<h3>En construction...</h3>
			<p>Quelque chose de sympa est en train de se construire. 👀</p>
		</div>
	);
}
