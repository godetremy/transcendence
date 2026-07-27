import styles from './component.module.scss';
import { CardHeader } from '@/components/globals/CardHeader/CardHeader';
import { OrganisationPermissionEditor } from '@/components/organization/OrganizationPermissionEditor/OrganisationPermissionEditor';
import { useEffect, useRef, useState } from 'react';
import { OrganizationPermissionDetails } from '@/types/OrganizationPermissionDetails';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { OrganizationPermissionSchema } from '@/schema/OrganizationPermissionSchema';
import { useMutation } from '@tanstack/react-query';
import { updateOrganizationPermission } from '@/lib/fetcher/organization';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';

export function OrganizationPermissionUpdateCard({
	close,
	permission,
}: {
	close: () => void;
	permission: OrganizationPermissionDetails;
}) {
	const { openModal, closeModal } = useModal();
	const organizationCtx = useOrganizations();
	const organization = organizationCtx.getCurrentOrganization()!;
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const [permissionValue, setPermissionValue] = useState<OrganizationPermissionDetails>(permission);

	const updatePermission = useMutation(updateOrganizationPermission(organization.id, permission.id));
	const fetchPermission = (permission: OrganizationPermissionDetails) => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		timeoutRef.current = setTimeout(() => {
			updatePermission.mutate({ permission: permission });
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		}, 1000);
	};

	const deletePermission = () => {
		openModal({
			title: `Veux-tu vraiment supprimer la permission ${permissionValue.name}`,
			message:
				'Cette action est définitive. Une fois supprimée, cette permission ne pourra pas être récupérée et devra être recréée manuellement si nécessaire.',
			buttons: [
				{
					text: 'Finalement non',
					onClick: closeModal,
				},
				{
					text: 'Supprimer définitivement',
					negative: true,
					onClick: closeModal,
				},
			],
		});
	};

	useEffect(() => {
		if (OrganizationPermissionSchema.safeParse(permissionValue).success) fetchPermission(permissionValue);
	}, [permissionValue]);

	return (
		<div className={styles.container}>
			<CardHeader title={'Modifier une permission'} onClose={close} />
			<main>
				<OrganisationPermissionEditor permission={permissionValue} setPermission={setPermissionValue} />
				<ListContainer>
					<ListItem
						title={'Supprimer cette permission'}
						negative
						last
						showChevron={false}
						onPress={deletePermission}
					/>
				</ListContainer>
			</main>
		</div>
	);
}
