'use client';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import { OrganizationEditor } from '@/components/organization/OrganizationEditor/OrganizationEditor';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { useState } from 'react';
import { CreateOrganizationType } from '@/types/Organization';

export default function Page() {
	const organizationCtx = useOrganizations();

	const [organization, setOrganization] = useState(
		organizationCtx.getCurrentOrganization()! as CreateOrganizationType
	);

	return (
		<NavigationBarHeader title={'Mon organisation'}>
			<OrganizationEditor organization={organization} setOrganization={setOrganization} />
		</NavigationBarHeader>
	);
}
