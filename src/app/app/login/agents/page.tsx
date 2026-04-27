import Link from 'next/link';

export default function Page() {
	return (
		<div>
			<h1>CONNEXION AGENTS</h1>
			<p>Pour accéder à vos services connectez vous avec vos identifiants.</p>
			<p>Adresse e-mail</p>
			<input placeholder="michel.doe@bde.42angouleme.fr"></input>
			<p>Mot de passe</p>
			<input type="password" placeholder="*******"></input>
			<Link href="/app/login/agents/forgot-password">Mots de passe oublié ?</Link>
			<a href="/app/login/agents/signup">
				<p>Crée un nouveau compte.</p>
			</a>
			<Link href="/app/login/">Tu es étudiants ? C est par ici.</Link>
		</div>
	);
}
