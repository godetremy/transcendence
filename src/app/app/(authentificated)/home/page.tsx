'use client';

import { deleteCookie } from '@/lib/cookie';
import { User } from '@/types/bde/User';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		fetch('/app/api/users/me')
			.then((res) => res.json())
			.then(setUser);
	}, []);

	const deleteAccount = async () => {
		await fetch('/app/api/users/me', {
			method: 'DELETE',
		});
		return redirect('/app/login');
	};

	const logout = () => {
		deleteCookie('session');
		return redirect('/app/login');
	};

	return (
		<>
			<p>Hello, World home !</p>
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
		</>
	);
}
