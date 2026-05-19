'use client';
import { useState } from 'react';

export default function Page() {
	const [response, setResponse] = useState<string>('');
	const [responseStatus, setResponseStatus] = useState<string>('');

	const validNameAndReason = async (form: FormData) => {
		const name = form.get('name');
		const reason = form.get('reason');
		if (name == null || reason == null) {
			setResponse('the field is empty');
			return ;
		}
		const response = await fetch('/app/api/users/me/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: name,
				password: reason,
			}),
		})
		if (!response.ok) {
			setResponse('Error to set value, retry please.');
		}
		setResponse('reason and fields are set.');
	};

	async function approvedAgent(id: string, status: boolean) {
		let statustostring = 'approve';
		if (status == false)
			statustostring = 'reject';
		const response = await fetch(`/app/api/auth/approval/${id}/${statustostring}/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		if (!response.ok) {
			setResponseStatus('Error to set value, retry please.');
			return ;
		}
		setResponseStatus('status are set.');
	}

	return (
		<>
			<form action={validNameAndReason}>
				<p>Nom de l agent :</p>
				<input type="text" placeholder="Nom" name="name"/>
				<p>raison :</p>
				<input type="text" placeholder="Reason" name="reason"></input>
				<br/>
				<button type='submit'
				>
					valider le nom et la raison
				</button>
			</form>
			{response && <p>{response}</p>}
			<div>
				<button
					onClick={async () => {
						await approvedAgent('2e2f842b-2e79-4a28-8357-764490c10de6', true);
					}}
				>
					valider compte
				</button>
				<button
					onClick={async () => {
						await approvedAgent('2e2f842b-2e79-4a28-8357-764490c10de6', false);
					}}
				>
					refuser compte
				</button>
			</div>
			{responseStatus && <p>{responseStatus}</p>}
		</>
	);
}
