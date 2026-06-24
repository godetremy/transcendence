import styles from './component.module.scss';
import { CardHeader } from '@/components/globals/CardHeader/CardHeader';
import { OrganisationPermissionEditor } from '@/components/organization/OrganisationPermissionEditor/OrganisationPermissionEditor';
import { useEffect, useState } from 'react';
import { OrganizationPermissionDetails } from '@/types/OrganizationPermissionDetails';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { NULL_PERMISSIONS } from '@/const/permission';
import { OrganizationPermissionSchema } from '@/schema/OrganizationPermissionSchema';
import { useMutation } from '@tanstack/react-query';
import { CreateOrganizationPermission } from '@/lib/fetcher/organization';

export function OrganizationPermissionCreateCard({ close }: { close: () => void }) {
	const organizationCtx = useOrganizations();
	const organization = organizationCtx.getCurrentOrganization()!;

	const [validPermission, setValidPermission] = useState(false);
	const [creatingRole, setCreatingRole] = useState(false);
	const [permission, setPermission] = useState<OrganizationPermissionDetails>({
		...NULL_PERMISSIONS(organization.id),
		name: '',
		created_at: '',
		updated_at: '',
	});

	const createPermission = useMutation(CreateOrganizationPermission(organization.id));
	const onValidate = () => {
		createPermission.mutate({ permission: permission });
		setCreatingRole(true);
		setTimeout(close, 2000);
	};

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setValidPermission(OrganizationPermissionSchema.safeParse(permission).success);
	}, [permission]);

	return (
		<div className={styles.container}>
			<CardHeader
				title={'Nouvelle permission'}
				onClose={close}
				disabledAccept={!validPermission}
				onAccept={onValidate}
				loading={creatingRole}
			/>
			<main>
				<OrganisationPermissionEditor
					permission={permission}
					setPermission={setPermission}
					disabled={creatingRole}
				/>
			</main>
		</div>
	);
}
