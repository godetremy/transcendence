'use client';
import styles from './page.module.scss';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { StaffLoginPagesImages } from '@/const/StaffLoginPagesImages';
import { useState } from 'react';
import { Sublinks } from '@/components/login/Sublinks/Sublinks';
import { LoginText } from '@/components/login/LoginText/LoginText';

function Page() {
	const [image] = useState(() => {
		return StaffLoginPagesImages[Math.floor(Math.random() * StaffLoginPagesImages.length)];
	});
	const [counter, setCounter] = useState(20);
	function frontCounterValue() {
		setCounter(counter - 1);
	}

	return (
		<LoginTemplate
			background={{
				source: image.source,
				alt: image.alt,
			}}
		>
			<LoginText
				title={'verification identite'}
				description={'Pour vérifier votre identité, nous avons envoyer un code à l’adresse tcy***@g***.c**'}
			/>

			<form>
				<div className={styles.inputs}></div>
				<div className={styles.test}>
					<Sublinks
						links={[{ text: `Renvoyer un code (${counter}sec)`, onClick: () => frontCounterValue() }]}
					/>
				</div>
			</form>
		</LoginTemplate>
	);
}
export default Page;
