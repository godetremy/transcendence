'use client';
import { createContext, ReactNode, useContext, useState } from 'react';
import { PrivateOrganization } from '@/types/Organization';
import { useParams } from 'next/navigation';

const OrganizationsContext = createContext<{
	organizations: PrivateOrganization[];
	getCurrentOrganization: () => PrivateOrganization | undefined;
	updateCurrentOrganization: (updatedData: PrivateOrganization) => void;
}>({ organizations: [], getCurrentOrganization: () => undefined, updateCurrentOrganization: () => {} });

export interface OrganizationsProviderProps {
	children: ReactNode;
	organizations: PrivateOrganization[];
}

export function OrganizationsProvider({ children, organizations: initialOrganizations }: OrganizationsProviderProps) {
	const { org_id } = useParams();
	const [organizations, setOrganizations] = useState<PrivateOrganization[]>(initialOrganizations);

	const getCurrentOrganization = (): PrivateOrganization | undefined => {
		return organizations.find((org) => org.id === org_id);
	};

	const updateCurrentOrganization = (updatedData: PrivateOrganization): void => {
		setOrganizations((prev) => prev.map((org) => (org.id === updatedData.id ? updatedData : org)));
	};

	return (
		<OrganizationsContext.Provider value={{ organizations, getCurrentOrganization, updateCurrentOrganization }}>
			{children}
		</OrganizationsContext.Provider>
	);
}

export const useOrganizations = () => useContext(OrganizationsContext);
