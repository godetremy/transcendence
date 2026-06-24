'use client';

import { User } from '@/types/User';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MembershipButton } from '@/components/membership/MembershipButton/MembershipButton';
import QRCode from 'react-qr-code';
import { get, post } from '@/lib/fetcher';

export default function Page() {
	const [user, setUser] = useState<User<{ membership: true }> | null>(null);

	const [twoFactorAuthData, setTwoFactorAuthData] = useState<string | undefined>(undefined);

	useEffect(() => {
		fetch('/app/api/users/me')
			.then((res) => res.json())
			.then(setUser);
	}, []);

	return (
		<>
			<div
				style={{
					backgroundImage: 'url(/images/demo_profile.jpg)',
					backgroundSize: 'cover',
					backgroundOrigin: 'center',
					height: 300,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<div className={'content'}>
					<h1>Hello, world !</h1>
				</div>
			</div>
			<section className={'content'}>
				<MembershipButton />
				{user === null ? (
					<p>Loading...</p>
				) : (
					<>
						<p>first name : {user.first_name}</p>
						<p>last name : {user.last_name}</p>
						<p>full name : {user.full_name}</p>
						<p>mail : {user.mail}</p>
						<p>id : {user.id}</p>
						<p>is agent : {user.agent ? 'true' : 'false'}</p>
						<p>memberships id : {user.membership ? user.membership.id : '-'}</p>
						<p>start at : {user.membership?.start_at ?? '-'}</p>
						<p>end at : {user.membership?.end_at ?? '-'}</p>
					</>
				)}
				<Link href={'/app/api/auth/logout/'}>Log out</Link>
				<p>or</p>
				<Link href={'/app/api/users/me/delete/'}>Delete account</Link>

				<hr />

				<button
					onClick={async () => {
						const data = await get<{ success: boolean; uri: string }>('/users/me/2fa/configure/totp');
						setTwoFactorAuthData(data.uri);
					}}
				>
					Generate config
				</button>

				{twoFactorAuthData && <QRCode value={twoFactorAuthData} size={240} />}

				<form
					action={async (form: FormData) => {
						const result = await post<{ success: boolean }>('/users/me/2fa/configure/totp', {
							code: form.get('code'),
						});
						alert(result.success ? 'Succès' : 'Erreur');
					}}
				>
					<input type={'text'} placeholder={'TOTP CODE'} name={'code'} />
				</form>
			</section>
		</>
	);
}
