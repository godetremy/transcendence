'use client';

import { User } from '@/types/bde/User';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page() {
	const [user, setUser] = useState<User | null>(null);

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
				{user === null ? (
					<p>Loading...</p>
				) : (
					<>
						<p>first name : {user.first_name}</p>
						<p>last name : {user.last_name}</p>
						<p>full name : {user.full_name}</p>
						<p>mail : {user.mail}</p>
						<p>id : {user.id}</p>
						<p>is agent : {user.is_agent ? 'true' : 'false'}</p>
						<p>memberships id : {user.memberships_id ?? '-'}</p>
						<p>start at : {user.memberships?.start_at.toLocaleDateString() ?? '-'}</p>
						<p>end at : {user.memberships?.end_at.toLocaleDateString() ?? '-'}</p>
					</>
				)}
				<button
					onClick={() => {
						logout();
					}}
				>
					log out
				</button>
				<p>or</p>
				<button
					onClick={() => {
						deleteAccount();
					}}
				>
					delete account
				</button>
				<div style={{ height: 1000, background: 'red' }} />
			</section>
		</>
	);
}
