import { SignUpFrom } from '@/components/SignUpFrom';

export default function Page() {
	return (
		<>
			<h1>CREER UN COMPTE</h1>
			<p>Pour accéder à vos services inscrivez vous.</p>
			<SignUpFrom />
			<a href="/login/other/">
				<p>J'ai déjà un compte.</p>
			</a>
			<a href="/">
				<p>Tu es étudiants ? C'est par ici.</p>
			</a>
		</>
	);
}
