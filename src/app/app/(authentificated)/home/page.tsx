'use client';

import { User } from '@/types/User';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MembershipButton } from '@/components/membership/MembershipButton/MembershipButton';
import { useUpload } from '@/contexts/UploadTokenContext';
import { CircleLoader } from '@/components/globals/CircleLoader/CircleLoader';

export default function Page() {
	const upload = useUpload();
	const [user, setUser] = useState<User<{ membership: true }> | null>(null);

	const [file, setFile] = useState<File | null>(null);

	const [progress, setProgress] = useState(0);
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

				<div>
					<input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
					<button
						onClick={() => {
							upload.uploadFiles(file!, setProgress).then((res) => console.log(res.name));
						}}
						disabled={!file}
					>
						Upload
					</button>
					<div>Token: {upload.token}</div>
					<div>File: {file?.name ?? 'none'}</div>
					<div>Progress: {progress}%</div>
					<CircleLoader progress={progress} size={54} />
				</div>
			</section>
		</>
	);
}
