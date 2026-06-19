'use client';
import { createContext, ReactNode, useContext } from 'react';
import { PrivateOrganization } from '@/types/Organization';
import { useParams } from 'next/navigation';

const OrganizationsContext = createContext<{
	organizations: PrivateOrganization[];
	getCurrentOrganization: () => PrivateOrganization | undefined;
}>({ organizations: [], getCurrentOrganization: () => undefined });

export interface OrganizationsProviderProps {
	children: ReactNode;
	organizations: PrivateOrganization[];
}

export function OrganizationsProvider({ children, organizations }: OrganizationsProviderProps) {
	const { org_id } = useParams();

	const getCurrentOrganization = (): PrivateOrganization | undefined => {
		return organizations.find((org) => org.id === org_id);
	};

	return (
		<OrganizationsContext.Provider value={{ organizations, getCurrentOrganization }}>
			{children}
		</OrganizationsContext.Provider>
	);
}

export const useOrganizations = () => useContext(OrganizationsContext);
