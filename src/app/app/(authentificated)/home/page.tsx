'use client';
import { User } from '@/types/User';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { MembershipButton } from '@/components/membership/MembershipButton/MembershipButton';
import { useUpload } from '@/contexts/UploadTokenContext';
import { CircleLoader } from '@/components/globals/CircleLoader/CircleLoader';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';
import { ImageEditor } from '@/utils/image';
import { ImageEditorCard } from '@/components/globals/ImageEditor/ImageEditorCard';

export default function Page() {
	const { openModal } = useModal();
	const upload = useUpload();
	const [user, setUser] = useState<User<{ membership: true }> | null>(null);

	const [file, setFile] = useState<File | null>(null);
	const [render, setRender] = useState<Blob | null>(null);

	const [showEditor, setShowEditor] = useState<boolean>(false);
	const editor = useRef<ImageEditor | null>(null);

	const [progress, setProgress] = useState(0);
	useEffect(() => {
		editor.current = new ImageEditor();
		fetch('/app/api/users/me')
			.then((res) => res.json())
			.then(setUser);
		return () => editor.current?.destroy();
	}, []);

	useEffect(() => {
		if (!file) return;

		editor.current
			?.loadTexture(file)
			.then(() => editor.current?.edit({ brightness: 0, contrast: 0, sharpness: 0 }))
			.catch((e) => console.error(e))
			.finally(() => console.log('End load'));
	}, [file]);

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
				<button
					onClick={() =>
						openModal({
							title: 'Modal demo',
							message: 'Veniam nulla amet id incididunt consectetur.',
							textInput: {
								label: 'Text input',
								placeholder: 'Enter text',
								onRequestCompletion: (text) => {
									return new Promise((accept) => {
										setTimeout(() => {
											accept([
												{
													text: `${text} de fou`,
												},
												{
													text: `${text} de fou`,
												},
												{
													text: `${text} de fou`,
												},
												{
													text: `${text} de fou`,
												},
												{
													text: `${text} de fou`,
												},
												{
													text: `${text} de fou`,
												},
											]);
										}, 100);
									});
								},
							},
							buttons: [
								{ text: 'Cancel', negative: true },
								{
									text: 'Confirm',
									onClick: (e) => {
										console.log('Confirmed', e.text);
										e.preventClosing();
									},
								},
							],
						})
					}
				>
					Show modal
				</button>
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

				<button onClick={() => setShowEditor(true)}>open editor</button>
				<button onClick={() => document.body.appendChild(editor.current.canvas)}>Append canva to body</button>
				<button onClick={() => editor.current?.render().then(setRender)}>Render</button>
				<button
					onClick={() => {
						editor.current?.render().then((blob) => {
							upload.uploadFiles(blob, setProgress).then((res) => console.log(res));
						});
					}}
				>
					Render and upload
				</button>
				{render && <img src={URL.createObjectURL(render)} alt="render" style={{ maxWidth: '100%' }} />}

				<ImageEditorCard editor={editor} visible={showEditor} setVisible={setShowEditor} />
			</section>
		</>
	);
}
