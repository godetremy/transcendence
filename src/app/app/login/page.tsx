'use client';
import './page.scss';
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
		>
			<LoginText title={'Connexion'} description={'Pour accéder à tes services connecte toi avec 42.'} />

			<div className={'actions'}>
				<Link href={generateFortyTwoAuthorizationUrl()} className={'primary'}>
					<FortyTwo className={'icon'} />
					Connexion avec 42
				</Link>
			</div>

			<Sublinks links={[{ text: 'Vous êtes un agents extérieur ?', href: '/app/login/agents' }]} />
		</LoginTemplate>
	);
}
