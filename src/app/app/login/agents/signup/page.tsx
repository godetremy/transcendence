import { SignUpFrom } from '@/components/SignUpForm';
import Link from 'next/link';

export default function Page() {
	return (
		<>
			<h1>CREER UN COMPTE</h1>
			<p>Pour accéder à vos services inscrivez vous.</p>
			<SignUpFrom />
			<Link href="/app/login/agents/">J ai déjà un compte.</Link>
			<Link href="/app/login/">Tu es étudiants ? C est par ici.</Link>
		</>
	);
}
