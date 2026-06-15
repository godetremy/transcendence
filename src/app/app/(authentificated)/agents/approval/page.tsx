'use client';
import { User } from '@/types/User';
import { useEffect, useState } from 'react';

function Card({ user, onResult }: { user: User; onResult: (msg: string) => void }) {
	return (
		<div className="card">
			<h2>Name</h2>
			<p>{user.full_name}</p>
			<h2>Reason</h2>
			<p>{user.agent_reason}</p>
			<h2>Mail</h2>
			<p>{user.mail}</p>
			<button
				onClick={async () => {
					await approvedAgent(user.id, onResult);
				}}
			>
				valider compte
			</button>
			<button
				onClick={async () => {
					await approvedAgent(user.id, onResult);
				}}
			>
				refuser compte
			</button>
			<br></br>
		</div>
	);
}

function CardList({ onResult }: { onResult: (msg: string) => void }) {
	const [users, setUsers] = useState<User[]>();

	useEffect(() => {
		const fetchusers = async () => {
			const response = await fetch(`/app/api/users/approval/pending/?limit=10&page=1`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (response.ok) {
				const value = await response.json();
				setUsers(value.data);
				return;
			}
			return;
		};

		fetchusers();
	}, []);

	return (
		<div>
			{users?.map((item, index) => (
				<Card key={index} user={item} onResult={onResult} />
			))}
		</div>
	);
}

async function approvedAgent(id: string, Onresult: (msg: string) => void) {
	const response = await fetch(`/app/api/users/approval/${id}/pending/`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (!response.ok) {
		Onresult('Error to set value, retry please.');
		return;
	}
	Onresult('status are set.');
}

export default function Page() {
	const [response, setResponse] = useState<string>('');
	const [responseStatus, setResponseStatus] = useState<string>('');

	const validNameAndReason = async (form: FormData) => {
		const name = form.get('name');
		const reason = form.get('reason');
		const response = await fetch('/app/api/users/me/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				full_name: name?.toString(),
				reason: reason?.toString(),
			}),
		});
		if (!response.ok) {
			setResponse('Error to set value, retry please.');
		}
		setResponse('fields is set.');
	};

	return (
		<>
			<form action={validNameAndReason}>
				<p>Nom de l agent :</p>
				<input type="text" placeholder="Nom" name="name" />
				<p>raison :</p>
				<input type="text" placeholder="Reason" name="reason"></input>
				<br />
				<button type="submit">valider le nom et la raison</button>
			</form>
			{response && <p>{response}</p>}
			<div>
				<h1>test list</h1>
				<CardList onResult={setResponseStatus}></CardList>
			</div>
			{responseStatus && <p>{responseStatus}</p>}
		</>
	);
}
