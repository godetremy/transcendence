'use client';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import { OrganizationEditor } from '@/components/organization/OrganizationEditor/OrganizationEditor';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { useEffect, useRef, useState } from 'react';
import { CreateOrganizationType } from '@/types/Organization';
import { useMutation } from '@tanstack/react-query';
import { updateOrganization } from '@/lib/fetcher/organization';

export default function Page() {
	const organizationCtx = useOrganizations();
	const org = organizationCtx.getCurrentOrganization();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const [organization, setOrganization] = useState(org! as CreateOrganizationType);
	const { mutate } = useMutation(updateOrganization(org!.id));

	useEffect(() => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		timeoutRef.current = setTimeout(() => {
			mutate({ org: organization });
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		}, 1000);
	}, [organization]);

	return (
		<NavigationBarHeader title={'Mon organisation'}>
			<OrganizationEditor organization={organization} setOrganization={setOrganization} />
		</NavigationBarHeader>
	);
}
