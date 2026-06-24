import styles from './component.module.scss';
import { CardHeader } from '@/components/globals/CardHeader/CardHeader';
import { OrganisationPermissionEditor } from '@/components/organization/OrganisationPermissionEditor/OrganisationPermissionEditor';
import { useEffect, useRef, useState } from 'react';
import { OrganizationPermissionDetails } from '@/types/OrganizationPermissionDetails';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { OrganizationPermissionSchema } from '@/schema/OrganizationPermissionSchema';
import { useMutation } from '@tanstack/react-query';
import { updateOrganizationPermission } from '@/lib/fetcher/organization';

export function OrganizationPermissionUpdateCard({
	close,
	permission,
}: {
	close: () => void;
	permission: OrganizationPermissionDetails;
}) {
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

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		if (OrganizationPermissionSchema.safeParse(permissionValue).success) fetchPermission(permissionValue);
	}, [permissionValue]);

	return (
		<div className={styles.container}>
			<CardHeader title={'Nouvelle permission'} onClose={close} />
			<main>
				<OrganisationPermissionEditor permission={permissionValue} setPermission={setPermissionValue} />
			</main>
		</div>
	);
}
