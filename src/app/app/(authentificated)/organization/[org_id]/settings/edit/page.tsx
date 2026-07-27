'use client';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import { OrganizationEditor } from '@/components/organization/OrganizationEditor/OrganizationEditor';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { useEffect, useRef, useState } from 'react';
import { CreateOrganizationType } from '@/types/Organization';
import { useMutation } from '@tanstack/react-query';
import { deleteOrganization, updateOrganization } from '@/lib/fetcher/organization';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';
import { useRouter } from 'next/navigation';
import { useToast, ToastType } from '@/components/globals/ToastProvider/ToastProvider';

export default function Page() {
	const organizationCtx = useOrganizations();
	const org = organizationCtx.getCurrentOrganization();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const router = useRouter();
	const toast = useToast();

	const [organization, setOrganization] = useState(org! as CreateOrganizationType);
	const mutation = useMutation(updateOrganization(org?.id ?? ''));
	const deleteOrg = useMutation(deleteOrganization(org?.id ?? ''));

	const { openModal, closeModal } = useModal();

	useEffect(() => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		timeoutRef.current = setTimeout(() => {
			mutation.mutateAsync({ org: organization }).then((data) => {
				organizationCtx.updateCurrentOrganization(data);
			});

			timeoutRef.current = null;
		}, 1000);
		return () => {
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, [organization, mutation, organizationCtx]);

	return (
		<NavigationBarHeader title={'Mon organisation'}>
			<OrganizationEditor organization={organization} setOrganization={setOrganization} />

			<ListContainer style={{ margin: '40px auto 0 auto' }}>
				<ListItem
					title={'Supprimer cette organisation'}
					last
					negative
					showChevron={false}
					onPress={() =>
						openModal({
							title: 'Voulez-vous vraiment supprimer cette organization ?',
							message:
								'Vous allez supprimer cette organisation, vous ne pourrez plus récupérer les informations, êtes-vous sûr ?',
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

										try {
											const check = await deleteOrg.mutateAsync();

											if (!check) {
												toast.showToast({
													title: 'Erreur',
													message: "Impossible de supprimer l'organisation.",
													type: ToastType.ERROR,
												});
												return;
											}

											toast.showToast({
												title: 'Succès',
												message: "L'organisation a été supprimée avec succès.",
												type: ToastType.SUCCESS,
											});

											router.push('/app/home');
										} catch (error) {
											console.error("Erreur lors de la suppression de l'organisation :", error);

											toast.showToast({
												title: 'Erreur',
												message: "Impossible de supprimer l'organisation.",
												type: ToastType.ERROR,
											});
										}
									},
								},
							],
						})
					}
				/>
			</ListContainer>
		</NavigationBarHeader>
	);
}
