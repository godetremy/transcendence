'use client';
import './page.scss';
import { useState } from 'react';
import Image from 'next/image';
import { StudentLoginPagesImages } from '@/const/StudentLoginPagesImages';
import { generateFortyTwoAuthorizationUrl } from '@/rest/fortytwo';
import { Eyes } from '@/components/stickers/eyes/Eyes';
import { FortyTwo } from '@/components/stickers/FortyTwo/FortyTwo';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';

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
		>
			<Eyes className={'stickers'} />

			<div className={'text'}>
				<h1>Connexion</h1>
				<p>Pour accéder à tes services connecte toi avec 42.</p>
			</div>

			<div className={'actions'}>
				<a href={generateFortyTwoAuthorizationUrl()} className={'primary'}>
					<FortyTwo className={'icon'} />
					Connexion avec 42
				</a>
				<a href={'/app/login/agents'} className={'secondary'}>
					Vous êtes un agents extérieur ?
				</a>
			</div>
		</LoginTemplate>
	);
}
