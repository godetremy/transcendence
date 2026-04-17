/* eslint-disable prettier/prettier */
export default function Page() {
    return (
        <div>
            <h1>CONNEXION AGENTS</h1>
            <p>Pour accéder à vos services connectez vous avec vos identifiants.</p>
            <p>Adresse e-mail</p>
            <input placeholder="michel.doe@bde.42angouleme.fr"></input>
            <p>Mot de passe</p>
            <input type="password" placeholder="*******"></input>
            <a href="/"><p>Mots de passe oublié ?</p></a>
            <a href="/login/other/signin"><p>Crée un nouveau compte.</p></a>
            <a href="/"><p>Tu es étudiants ? C'est par ici.</p></a>
            
        </div>
    );
}