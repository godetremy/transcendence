'use client';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import { OrganizationEditor } from '@/components/organization/OrganizationEditor/OrganizationEditor';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { useEffect, useRef, useState } from 'react';
import { CreateOrganizationType } from '@/types/Organization';
import { useMutation } from '@tanstack/react-query';
import { updateOrganization } from '@/lib/fetcher/organization';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';

export default function Page() {
	const organizationCtx = useOrganizations();
	const org = organizationCtx.getCurrentOrganization();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const [organization, setOrganization] = useState(org! as CreateOrganizationType);
	const mutation = useMutation(updateOrganization(org?.id ?? ''));

	useEffect(() => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		timeoutRef.current = setTimeout(() => {
			mutation.mutateAsync({ org: organization }).then((data) => {
				organizationCtx.updateCurrentOrganization(data);
			});
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		}, 1000);
	}, [organization]);

	return (
		<NavigationBarHeader title={'Mon organisation'}>
			<OrganizationEditor organization={organization} setOrganization={setOrganization} />

			<ListContainer style={{ margin: '40px auto 0 auto' }}>
				<ListItem title={'Supprimer cette organisation'} last negative showChevron={false}/>
			</ListContainer>
		</NavigationBarHeader>
	);
}
