import { SignUpFrom } from '@/components/SignUpFrom';
import Link from 'next/link';

export default function Page() {
	return (
		<>
			<h1>CREER UN COMPTE</h1>
			<p>Pour accéder à vos services inscrivez vous.</p>
			<SignUpFrom />
			<Link href="/login/other/">J ai déjà un compte.</Link>
			<Link href="/">Tu es étudiants ? C est par ici.</Link>
		</>
	);
}
