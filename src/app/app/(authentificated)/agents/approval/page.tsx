'use client';
import { setUserName, setUserReason } from '@/database/users/setUser';
import { useState } from 'react';

export default function Page() {
	const [responseName, setResponseName] = useState<string>('');
	const [responseReason, setResponseReason] = useState<string>('');

	const validName = async (form: FormData) => {
		const value = form.get('name');
		if (value != null) {
			const status = await setUserName(value.toString());
			setResponseName(status);
		} else {
			setResponseName('the field is empty');
		}
	};

	const validReason = async (form: FormData) => {
		const value = form.get('reason');
		if (value != null) {
			const status = await setUserReason(value.toString());
			setResponseReason(status);
		} else {
			setResponseReason('the field is empty');
		}
	};
	return (
		<>
			<form action={validName}>
				<p>Nom de l agent :</p>
				<input type="text" placeholder="Nom" name="name" required={true} />
			</form>
			{responseName && <p>{responseName}</p>}
			<form action={validReason}>
				<p>raison :</p>
				<input type="text" placeholder="Reason" name="reason" required={true}></input>
			</form>
			{responseReason && <p>{responseReason}</p>}
			<div>
				<button>valider compte</button>
				<button>refuser compte</button>
			</div>
		</>
	);
}
