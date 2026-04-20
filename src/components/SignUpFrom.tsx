'use client';

import { SignupFormFrontSchema } from '@/schema/SignupForm';
import { useState } from 'react';

export function SignUpFrom() {
	const [error, setError] = useState<string | null>(null);

	const signUp = async (form: FormData) => {
		const fields = SignupFormFrontSchema.safeParse({
			email: form.get('email'),
			password: form.get('password'),
			passwordCheck: form.get('passwordCheck'),
		});

		if (!fields.success) {
			setError(fields.error.issues[0].message);
			return;
		}
		const response = await fetch('/api/login/agents/signup/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: 'test',
				email: fields.data.email,
				password: fields.data.password,
				member_card: false,
			}),
		});

		const result = await response.json();
		console.log(result);
	};

	return (
		<div>
			<form action={signUp}>
				<label htmlFor="email">Adresse e-mail</label>
				<input name="email" placeholder="michel.doe@bde.42angouleme.fr"></input>

				<label htmlFor="password">Mot de passe</label>
				<input name="password" type="password" placeholder="*******"></input>

				<label htmlFor="passwordCheck">Confirmation du mot de passe</label>
				<input name="passwordCheck" type="password" placeholder="*******"></input>

				{error && <p>{error}</p>}
				<button type="submit">sign up</button>
			</form>
		</div>
	);
}
