'use client';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { User2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
	const [error, setError] = useState<string | null>(null);
	const route = useRouter();

	const getCode = async (form: FormData) => {
		const code = form.get('numbers');

		if (!code) {
			setError('Error');
			return;
		}

		const response = await fetch('/app/api/auth/forgot-password/claim-code', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				code: code,
			}),
		});

		if (response.ok) {
			const data = await response.json();
			setError(data.message);
			route.push(data.redirect);
		}

		return;
	};

	return (
		<form action={getCode}>
			<div className={'inputs'}>
				<LoginTextInput
					name={'numbers'}
					type={'text'}
					icon={<User2 />}
					nameLabel={'Suite de nombres'}
					placeholder={'12345'}
				/>
			</div>

			{error && <p className={'error'}>{error}</p>}

			<input type={'submit'} value={'Envoyer'} />
		</form>
	);
}
