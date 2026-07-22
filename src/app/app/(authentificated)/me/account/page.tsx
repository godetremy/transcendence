'use client';

import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import ModificationText from '@/components/globals/ModificationText/ModificationText';
import { useUser } from '@/contexts/UserContext';
import { useEffect, useRef, useState } from 'react';
import { User } from '@/types/User';
import { UserUpdateParameters } from '@/types/UserUpdateParameters';
import { useMutation } from '@tanstack/react-query';
import { deleteUser, logoutUser, updateUser } from '@/lib/fetcher/user';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';
import { useRouter } from 'next/navigation';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import { getCsrfTokenFromCookie } from '@/utils/csrf';

function Page() {
	const userCtx = useUser();
	const { openModal, closeModal } = useModal();
	const router = useRouter();

	const [user, setUser] = useState<User>(userCtx!);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const mutation = useMutation(updateUser(user.id));

	const { mutateAsync } = useMutation(logoutUser({ 'x-csrf-token': getCsrfTokenFromCookie() ?? '' }));
	const delUser = useMutation(deleteUser({ 'x-csrf-token': getCsrfTokenFromCookie() ?? '' }));

	useEffect(() => {
		const value: UserUpdateParameters = {
			mail: user.mail ?? undefined,
			first_name: user.first_name ?? undefined,
			last_name: user.last_name ?? undefined,
		};

		timeoutRef.current = setTimeout(async () => {
			await mutation.mutateAsync({ user: value }).then((user) => {
				userCtx?.update(user);
			});
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		}, 1000);
	}, [user]);

	return (
		<NavigationBarHeader title={'Mon compte'}>
			<section className={styles.section}>
				<span className={styles.listSectionTitle}>Informations personnelles</span>

				<ListContainer>
					<ListItem
						title={'Nom'}
						rightElement={
							<ModificationText
								value={user?.last_name || ''}
								onValidate={(value) => setUser((prev) => ({ ...prev, last_name: value }))}
							/>
						}
						showChevron={false}
					/>
					<ListItem
						title={'Prénom'}
						rightElement={
							<ModificationText
								value={user?.first_name || ''}
								onValidate={(value) => setUser((prev) => ({ ...prev, first_name: value }))}
							/>
						}
						showChevron={false}
					/>
					<ListItem
						title={'Adresse e-mail'}
						rightElement={
							<ModificationText
								value={user?.mail || ''}
								onValidate={(value) => setUser((prev) => ({ ...prev, mail: value }))}
							/>
						}
						showChevron={false}
						last
					/>
				</ListContainer>
				<ListContainer>
					<ListItem
						showChevron={false}
						negative
						title={'Suppression mon compte'}
						last
						onPress={() =>
							openModal({
								title: 'Supprimer mon compte ?',
								message: 'Vous allez supprimer votre compte. Vous ne pourrez plus utiliser ce compte.',
								buttons: [
									{
										text: 'Annuler',
										onClick: closeModal,
									},
									{
										text: 'Supprimer',
										negative: true,
										onClick: async () => {
											closeModal();
											const res = await delUser.mutateAsync();
											if (res.success) {
												const check = await mutateAsync();
												if (check.success) router.push('/app/login');
											}
										},
									},
								],
							})
						}
					/>
				</ListContainer>
			</section>
		</NavigationBarHeader>
	);
}

export default Page;
