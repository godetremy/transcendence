'use client';
import styles from './page.module.scss';
import EmojiSunglasses from '@/components/stickers/EmojiSunglasses/EmojiSunglasses';
import Terms from '@/snippets/Terms.mdx';
import { useState } from 'react';
import { Eyes } from '@/components/stickers/Eyes/Eyes';
import { LoginTextInput } from '@/components/login/LoginTextInput/LoginTextInput';
import { KeyRound, Quote, User2 } from 'lucide-react';
import { Loader } from '@/components/globals/Loader/Loader';
import { SignupFormSchema } from '@/schema/SignupSchema';
import { post, put } from '@/lib/fetcher';
import { Card } from '@/components/globals/Card/Card';
import { TotpConfiguration } from '@/components/2fa/TotpConfiguration/TotpConfiguration';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';
import { CreateOrganizationSchema } from '@/schema/OrganizationSchema';

export default function Setup() {
	const { openModal, closeModal } = useModal();

	const [page, setPage] = useState(5);
	const [acceptedCGU, setAcceptedCGU] = useState(false);

	const [creatingAccount, setCreatingAccount] = useState(false);
	const [mailInput, setMailInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');
	const [passwordConfirmInput, setPasswordConfirmInput] = useState('');
	const [creatingAccountError, setCreatingAccountError] = useState<string | undefined>(undefined);

	const [showTotpConfiguration, setShowTotpConfiguration] = useState<boolean>(false);

	const [creatingOrganisation, setCreatingOrganisation] = useState(false);
	const [organisationNameInput, setOrganisationNameInput] = useState('');
	const [creatingOrganisationError, setCreatingOrganisationError] = useState<string | undefined>(undefined);

	const [markingAsDone, setMarkingAsDone] = useState<boolean>(false);

	const createAdminAccount = () => {
		setCreatingAccount(true);
		const fields = SignupFormSchema.safeParse({
			mail: mailInput,
			password: passwordInput,
			passwordCheck: passwordConfirmInput,
		});

		if (!fields.success) {
			setCreatingAccountError(fields.error.issues[0].message);
			setCreatingAccount(false);
			return;
		}

		setTimeout(() => {
			post<{ success: boolean; message?: string }>('/auth/signup/', fields.data).then((res) => {
				if (res.success) {
					setPage(page + 1);
					setCreatingAccount(false);
					return;
				}
				setCreatingAccount(false);
				setCreatingAccountError(res.message);
			});
		}, 1500);
	};

	const createOrganisation = () => {
		setCreatingOrganisation(true);
		const fields = CreateOrganizationSchema.safeParse({
			name: organisationNameInput,
		});

		if (!fields.success) {
			setCreatingOrganisationError(fields.error.issues[0].message);
			setCreatingOrganisation(false);
			return;
		}

		setTimeout(() => {
			post<{ success: boolean; message?: string }>('/organization', fields.data).then((res) => {
				if (res.success) {
					setPage(page + 1);
					setCreatingOrganisation(false);
					return;
				}
				setCreatingOrganisation(false);
				setCreatingOrganisationError(res.message);
			});
		}, 1500);
	};

	const markSetupDone = async () => {
		setMarkingAsDone(true);
		const res = await put<{ success: boolean }>('/setup', {});

		if (res.success) {
			window.location.href = '/app/home';
			return;
		}
		alert("Une erreur c'est produite. Réessayez plus tard.");
		setMarkingAsDone(false);
	};

	const cancelTotpConfiguration = () => {
		openModal({
			title: 'Voulez-vous vraiment annuler la configuration ?',
			message: 'Vous pourrez reprendre cette configuration à tout moment.',
			buttons: [
				{
					text: 'Revenir à la configuration',
					onClick: closeModal,
				},
				{
					text: 'Annuler la configuration',
					negative: true,
					onClick: () => {
						setShowTotpConfiguration(false);
						closeModal();
					},
				},
			],
		});
	};

	return (
		<div className={styles.main}>
			<div className={styles.pages_container} style={{ transform: `translateX(${-(page - 1) * (100 / 5)}%)` }}>
				<div className={`${styles.page} ${page !== 1 ? styles.disabled : ''}`}>
					<header>
						<EmojiSunglasses size={120} />
						<h1>BIENVENUE!</h1>
						<p>
							Cupidatat duis esse Lorem culpa sint anim sunt nisi adipisicing minim esse et ullamco quis.
						</p>
					</header>
					<main>
						<div className={styles.terms_container}>
							<Terms />
						</div>
						<label className={styles.terms_checkbox}>
							<input type="checkbox" onChange={(e) => setAcceptedCGU(e.target.checked)} />
							Accepter les conditions générales d&#39;utilisation
						</label>
					</main>
					<footer>
						<button disabled>Retour</button>
						<button className={styles.primary} disabled={!acceptedCGU} onClick={() => setPage(page + 1)}>
							Continuer
						</button>
					</footer>
				</div>

				<div className={`${styles.page} ${page !== 2 ? styles.disabled : ''}`}>
					<header>
						<Eyes width={120} />
						<h1>CONFIGURE LE COMPTE ADMIN</h1>
						<p>
							Créez le compte administrateur principal de cette instance. Il bénéficiera de toutes les
							autorisations nécessaires pour administrer l’application, les organisation et la
							configuration globale.
						</p>
					</header>
					<main className={styles.signup_container}>
						<LoginTextInput
							name={'mail'}
							type={'mail'}
							icon={<User2 />}
							nameLabel={'Adresse e-mail'}
							placeholder={'michel.doe@bde.42angouleme.fr'}
							required={true}
							onChange={(e) => setMailInput(e.target.value)}
							value={mailInput}
							disabled={creatingAccount}
						/>
						<LoginTextInput
							name={'password'}
							type={'password'}
							icon={<KeyRound />}
							nameLabel={'Mot de passe'}
							placeholder={'••••••••••••'}
							required={true}
							onChange={(e) => setPasswordInput(e.target.value)}
							value={passwordInput}
							disabled={creatingAccount}
						/>
						<LoginTextInput
							name={'passwordCheck'}
							type={'password'}
							icon={<KeyRound />}
							nameLabel={'Confirmation du mot de passe'}
							placeholder={'••••••••••••'}
							required={true}
							onChange={(e) => setPasswordConfirmInput(e.target.value)}
							value={passwordConfirmInput}
							disabled={creatingAccount}
						/>
						<p className={styles.error}>{creatingAccountError}</p>
					</main>
					<footer>
						<button onClick={() => setPage(page - 1)} disabled={creatingAccount}>
							Retour
						</button>
						<button className={styles.primary} disabled={creatingAccount} onClick={createAdminAccount}>
							{creatingAccount && <Loader size={30} />}
							{creatingAccount ? 'Création en cours...' : 'Crée mon compte'}
						</button>
					</footer>
				</div>

				<div className={`${styles.page} ${page !== 3 ? styles.disabled : ''}`}>
					<header>
						<Eyes width={120} />
						<h1>CONFIGURER LA DOUBLE AUTHENTIFICATION</h1>
						<p>
							En tant qu&#39;administrateur, vous devez configurer la double authentification. Elle sera
							requise pour effectuer des opérations sensible.
						</p>
					</header>
					<main></main>
					<footer>
						<button disabled>Retour</button>
						<button className={styles.primary} onClick={() => setShowTotpConfiguration(true)}>
							Configurer la 2FA
						</button>
					</footer>
				</div>

				<div className={`${styles.page} ${page !== 4 ? styles.disabled : ''}`}>
					<header>
						<Eyes width={120} />
						<h1>CREATION D&#39;UNE ORGANISATION</h1>
						<p>Créez la première organisation afin de poster des événements, des services.</p>
					</header>
					<main className={styles.signup_container}>
						<LoginTextInput
							name={'name'}
							type={'text'}
							icon={<Quote />}
							nameLabel={"Nom de l'organisation"}
							placeholder={'Mon super club de dance'}
							required={true}
							onChange={(e) => setOrganisationNameInput(e.target.value)}
							value={organisationNameInput}
							disabled={creatingOrganisation}
						/>
						<p className={styles.error}>{creatingOrganisationError}</p>
					</main>
					<footer>
						<button disabled={creatingOrganisation}>Utiliser les informations de démonstration</button>
						<button
							className={styles.primary}
							disabled={creatingOrganisation || organisationNameInput.trim() === ''}
							onClick={createOrganisation}
						>
							{creatingOrganisation && <Loader size={30} />}
							{creatingOrganisation ? 'Création en cours...' : 'Crée mon organisation'}
						</button>
					</footer>
				</div>

				<div className={`${styles.page} ${page !== 5 ? styles.disabled : ''}`}>
					<header style={{ margin: 'auto 0' }}>
						<Eyes width={120} />
						<h1>C&#39;EST BON POUR NOUS</h1>
						<p>
							Excellente nouvelle, la configuration s&#39;est déroulée avec succès. Votre environnement
							est est maintenant opérationnel et prêt à accueillir vos premiers utilisateurs.
							Connectez-vous votre compte administrateur pour finaliser les derniers réglages ou commencer
							immédiatement à utiliser la plateforme.
						</p>
					</header>
					<footer>
						<button disabled>Retour</button>
						<button className={styles.primary} onClick={markSetupDone} disabled={markingAsDone}>
							{markingAsDone && <Loader size={30} />}
							Terminer la configuration
						</button>
					</footer>
				</div>
			</div>
			<Card visible={showTotpConfiguration} requestClose={cancelTotpConfiguration}>
				<TotpConfiguration
					requestClose={cancelTotpConfiguration}
					forceClose={() => {
						setShowTotpConfiguration(false);
						setPage(page + 1);
					}}
				/>
			</Card>
		</div>
	);
}
