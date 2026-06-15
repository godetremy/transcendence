import { MailContent } from '@/lib/email';

export default function ForgotPasswordMail(token: string): MailContent {
	const subject: string = 'Réinitialisation de votre mot de passe';

	const data = {
		paragraph:
			'Vous avez demandé à récupérer votre mot de passe. Veuillez cliquer sur le bouton ci-dessous pour commencer la procédure.\n\nSi vous n’êtes pas à l’origine de cette demande de réinitialisation, veuillez ignorer ce message ou vérifier votre compte depuis la page d’accueil afin de vous assurer de la sécurité de votre compte.',
		link: `${process.env.NEXT_PUBLIC_BASE_URL}/app/login/agents/forgot-password/${token}`,
		expire: 10,
	};

	const text: string = `${data.paragraph}\n\n[Changer mon mot de pass]: ${data.link}\n\nNote: Ce lien expire dans ${data.expire}min.\n`;
	const html: string = `
	<html lang="fr">
  <body>
    <p>Bonjour,</p>

    <p>
      ${data.paragraph}
    </p>

    <p>
      <a href="${data.link}">
        Réinitialiser mon mot de passe
      </a>
    </p>

    <p>
      Ce lien est valable pendant ${data.expire} minutes.
    </p>

    <p>
      Si vous n'êtes pas à l'origine de cette demande,
      ignorez simplement cet email.
    </p>
  </body>
</html>
	`; //TODO: UPDATE MAIL

	return { subject, text, html };
}
