import { NextResponse } from 'next/server';
import { ApiError } from 'next/dist/server/api-utils';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

const ERRORS_DETAILS: Record<string, (...args: string[]) => ApiError> = {
	internal_error: () => new ApiError(500, 'Internal server error'),
	unsupported_content_type: () => new ApiError(400, 'Unsupported content type.'),
	file_not_found: () => new ApiError(404, 'This file does not exist.'),
	already_admin: () => new ApiError(401, 'This user is already admin.'),

	already_exists: (parameter: string) => new ApiError(400, `Ce ${parameter} existe déjà.`),
	does_not_exists: (parameter: string) => new ApiError(404, `${parameter} n’existe pas.`),

	invalid_oauth_error: () => new ApiError(401, 'Invalid code'),
	session_expired: () => new ApiError(401, 'This session expired.'),
	two_factor_auth_not_configured: () => new ApiError(409, 'Le 2FA n’est pas configuré sur ce compte.'),
	two_factor_auth_method_not_enabled: () =>
		new ApiError(403, 'La méthode 2FA que vous utilisez n’est pas configurée sur ce compte.'),
	failed_to_configure_totp: () => new ApiError(500, 'An error occured while configuring your one time based code.'),
	invalid_totp_code: () => new ApiError(401, 'Le code que vous avez saisi n’est pas valide.'),
	two_factor_auth_required: () => new ApiError(401, 'Une authentification à deux facteurs est requise pour ce compte.'),
	two_factor_auth_not_implemented: () => new ApiError(501, 'This 2FA method is not implemented yet.'),
	invalid_mail_password: () => new ApiError(401, 'Email ou mot de passe non valide'),

	invalid_body: () => new ApiError(400, 'Corps non valide.'),
	missing_parameter: (parameter: string) => new ApiError(400, `Paramètre requis manquant \'${parameter}\'.`),
	invalid_parameter: (parameter: string) => new ApiError(400, `Le paramètre suivant \'${parameter}\' est non valide.`),
	
	password_not_set: () => new ApiError(400, "Il semble que votre mot de passe ne soit pas défini. Êtes-vous étudiant ?"),
	account_exist_with_mail: () => new ApiError(409, 'Un compte est déjà lié à cette adresse e-mail.'),
	account_unsupported_action: () => new ApiError(403, 'Cette action n’est pas prise en charge pour ce compte'),

	organization_does_not_verified: () => new ApiError(400, 'Cette organisation n’est pas vérifiée par l’administrateur.'),
	organization_member_already_invited: () => new ApiError(403, 'Ce membre a déjà été invité.'),
	member_not_in_organization: () => new ApiError(403, 'Ce membre ne fait pas partie de l’organisation.'),
	member_already_accepted: () => new ApiError(403, 'Ce membre a déjà été accepté dans l’organisation.'),
	refused_delete_member: () => new ApiError(403, "Vous ne pouvez pas supprimer ce membre."),

	permission_denied: () => new ApiError(403, 'Vous n’êtes pas autorisé(e) à exécuter cette action.'),
	permission_does_not_exists: () => new ApiError(403, "Cette permission n’existe pas."),
	refused_define_permissions: () => new ApiError(403, "Vous ne pouvez pas définir des permissions."),
	cant_remove_last_admin: () => new ApiError(401, "Vous ne pouvez pas quitter votre rôle d’administrateur car vous êtes le dernier administrateur."),
	cant_leave_as_owner: () => new ApiError(403, "Vous ne pouvez pas quitter cette organisation parce que vous en êtes le propriétaire."),
	permission_in_use: () => new ApiError(403, 'La permission est actuellement utilisée.'),

	event_max_inscription: () => new ApiError(409, 'Cet événement est complet.'),
	event_does_not_register: () => new ApiError(400, 'Il semblerait que vous ne soyez pas enregistré pour cet événement.'),
	event_has_register: () => new ApiError(400, 'Il semblerait que vous soyez déjà enregistré pour cet événement.'),
	
	category_does_not_exists: () => new ApiError(403, "Cette catégorie n’existe pas."),
	
	photo_does_not_exist: () => new ApiError(403, 'Cette photo n’existe pas.'),
	too_many_upload: () => new ApiError(429, 'Vous avez demandé trop de téléchargements. Veuillez patienter quelques heures et réessayer.'),
	
	sumup_does_not_exist_url: () => new ApiError(403, 'Aucune URL de paiement hébergée renvoyée par SumUp.'),
};

const formatError = (error: ApiError) => {
	return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
};

const errorHandler = async (fn: () => Promise<NextResponse>): Promise<NextResponse> => {
	try {
		return await fn();
	} catch (error: unknown) {
		if (isRedirectError(error)) throw error;
		if (error instanceof ApiError) return formatError(error);
		console.error(error);
		return formatError(ERRORS_DETAILS.internal_error());
	}
};

export { ERRORS_DETAILS, errorHandler };
