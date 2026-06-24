'use client';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import { useEffect, useState } from 'react';
import { User } from '@/types/User';
import { deletef, get, put } from '@/lib/fetcher';
import { EmptyState } from '@/components/globals/EmptyState/EmptyState';
import { Loader } from '@/components/globals/Loader/Loader';
import { useUser } from '@/contexts/UserContext';
import Image from 'next/image';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AdminAppendBodySchema } from '@/schema/AdminAppendBodySchema';

function Page() {
	const user = useUser();
	const modal = useModal();
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [administrators, setAdministrators] = useState<User[]>([]);

	const [mailInput, setMailInput] = useState('');
	const [isValidInvite, setIsValidInvite] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	const addAdministrator = () => {
		put<User>('/users/admin', { mail: mailInput })
			.then((res) => {
				setAdministrators((prev) => [...prev, res]);
				setMailInput('');
			})
			.catch((err: Error) => setError(err.message));
	};

	const removeAdministrator = (id: string, name: string) => {
		modal.openModal({
			title:
				id === user?.id
					? 'Est-tu sur de vouloir quitter le rôle administrateur ?'
					: `Est-tu sûr de vouloir retirer « ${name} » des administrateurs ?`,
			message:
				id === user?.id
					? "Tu ne pourras plus accéder au fonction d'administration tant que tu n'es pas de nouveau administrateur. Une fois quitter tu seras ramener sur ta page de profile."
					: "Cette personne n'auras plus accès au accès de gestion du service.",
			buttons: [
				{
					text: id === user?.id ? 'Oui, je démissionne' : 'Oui, je le retire',
					negative: true,
					onClick: () => {
						deletef<{ success: boolean }>(`/users/admin/${id}`, {}).then(() => {
							modal.closeModal();
							if (id === user?.id) window.location.href = '/app/me';
							setAdministrators((admin) => admin.filter((admin) => admin.id !== id));
						});
					},
				},
				{
					text: id === user?.id ? 'Finalement je reste' : 'Finalement il reste',
					onClick: modal.closeModal,
				},
			],
		});
	};

	useEffect(() => {
		if (!user?.admin) router.replace('/app/me');
		get<User[]>('/users/admin')
			.then((res) => setAdministrators(res))
			.finally(() => setLoading(false));
	}, [router, user?.admin]);

	return (
		<>
			<NavigationBarHeader title={'Administration'}>
				<section className={styles.section}>
					<form action={addAdministrator}>
						<input
							type={'email'}
							placeholder={'Adresse e-mail à ajouter comme administrateur'}
							value={mailInput}
							onChange={(e) => {
								setMailInput(e.target.value);
								setError(undefined);
								const result = AdminAppendBodySchema.safeParse({
									mail: e.target.value,
								});
								setIsValidInvite(result.success);
							}}
						/>
						<input type={'submit'} value={'Ajouter'} disabled={!isValidInvite} />
					</form>
					{error && <p className={styles.error}>{error}</p>}
					<span className={styles.listSectionTitle}>Administrateurs</span>
					{loading ? (
						<Loader />
					) : (
						<>
							{administrators.length === 0 && !loading ? (
								<EmptyState />
							) : (
								<div className={styles.list}>
									{administrators
										?.sort((v) => {
											if (v.id === user?.id) return -10000;
											return 1;
										})
										.map((admin, i) => (
											<ListItem
												key={i}
												title={admin.id === user?.id ? 'Toi' : (admin.full_name ?? admin.id)}
												description={admin.mail}
												showChevron={false}
												hoverEffect={false}
												leftElement={
													<Image
														src={admin.profile_picture}
														width={40}
														height={40}
														alt={`Photo de ${admin.full_name ?? admin.id}`}
														className={styles.profilePicture}
													/>
												}
												rightElement={
													admin.id === user?.id ? undefined : (
														<div
															role={'button'}
															onClick={() =>
																removeAdministrator(
																	admin.id,
																	admin.full_name ?? admin.id
																)
															}
															className={styles.excludeButton}
														>
															<X />
															Exclure
														</div>
													)
												}
												last={i === administrators.length - 1}
											/>
										))}
								</div>
							)}
						</>
					)}

					<div className={styles.list}>
						<ListItem
							title={"Quitter l'administration"}
							showChevron={false}
							last
							negative
							disabled={administrators.length <= 1}
							onPress={() => removeAdministrator(user?.id ?? '', user?.full_name ?? user?.id ?? '')}
						/>
					</div>
					{administrators.length <= 1 && !loading && (
						<span className={styles.listSectionDetails}>
							Tu ne peux pas quitter ton rôle d&#39;administrateur car tu es le seul administrateur. Pour
							quitter ton rôle, ajoute un autre administrateur avant de quitter.
						</span>
					)}
				</section>
			</NavigationBarHeader>
		</>
	);
}

export default Page;
