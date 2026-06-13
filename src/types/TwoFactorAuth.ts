export interface TwoFactorAuthResponse {
	mail: boolean;
	totp: boolean;
	passkey: boolean;
}
