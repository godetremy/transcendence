'use client';
import styles from './page.module.scss';
import { useState } from 'react';
import { StudentLoginPagesImages } from '@/const/StudentLoginPagesImages';
import { generateFortyTwoAuthorizationUrl } from '@/rest/fortytwo';
import { FortyTwo } from '@/components/stickers/FortyTwo/FortyTwo';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { LoginText } from '@/components/login/LoginText/LoginText';
import { Sublinks } from '@/components/login/Sublinks/Sublinks';
import Link from 'next/link';

export default function Page() {
	const [image] = useState(() => {
		return StudentLoginPagesImages[Math.floor(Math.random() * StudentLoginPagesImages.length)];
	});

	return (
		<LoginTemplate
			background={{
				source: image.source,
				alt: image.alt,
			}}
			contentClassName={styles.container}
		>
			<LoginText title={'Connexion'} description={'Pour accéder à tes services connecte toi avec 42.'} />

			<div className={styles.actions}>
				<Link href={generateFortyTwoAuthorizationUrl()} className={styles.primary}>
					<FortyTwo className={styles.icon} />
					Connexion avec 42
				</Link>
			</div>

			<Sublinks links={[{ text: 'Vous êtes un agents extérieur ?', href: '/app/login/agents' }]} />
		</LoginTemplate>
	);
}
