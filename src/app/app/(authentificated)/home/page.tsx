'use client';

export default function Page() {
	const test = () => {
		fetch('/app/api/users/me', {
			method: 'DELETE',
		})
	}
	return (
		<>
			<p>Hello, World !</p>
			<button onClick={() => {
				test();
			}}>delete account</button>
		</>
	);
}
