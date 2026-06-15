import * as z from 'zod';

export const ForgotPasswordParametersSchema = z.object({
	mail: z.email({ error: "Cette addresse n'est pas valide" }).trim(),
});
