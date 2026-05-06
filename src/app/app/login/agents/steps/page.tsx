'use client';

export default function Page() {
	const validName = async (form: FormData) => {
		fetch('/app/api/users/me/name', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/js',
			},
			body: JSON.stringify({
				name: form.get('name'),
			}),
		});
	};
	return (
		<>
			<form action={validName}>
				<p>Nom de l agent :</p>
				<input type="text" placeholder="Nom" name="name" />
			</form>
			<form>
				<p>raison :</p>
				<input type="text"></input>
				<button>valider raison</button>
			</form>
			<div>
				<button>valider compte</button>
				<button>refuser compte</button>
			</div>
		</>
	);
}
