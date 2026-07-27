'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { PrivateOrganization } from '@/types/Organization';
import { useParams } from 'next/navigation';

const OrganizationsContext = createContext<{
	organizations: PrivateOrganization[];
	getCurrentOrganization: () => PrivateOrganization | undefined;
	updateCurrentOrganization: (updatedData: PrivateOrganization) => void;
	currentOrganization?: PrivateOrganization;
}>({ organizations: [], getCurrentOrganization: () => undefined, updateCurrentOrganization: () => {} });

export interface OrganizationsProviderProps {
	children: ReactNode;
	organizations: PrivateOrganization[];
}

export function OrganizationsProvider({ children, organizations: initialOrganizations }: OrganizationsProviderProps) {
	const { org_id } = useParams();
	const [organizations, setOrganizations] = useState<PrivateOrganization[]>(initialOrganizations);
	const [currentOrganization, setCurrentOrganization] = useState<PrivateOrganization | undefined>();

	const getCurrentOrganization = (): PrivateOrganization | undefined => {
		return organizations.find((org) => org.id === org_id);
	};

	const updateCurrentOrganization = (updatedData: PrivateOrganization): void => {
		setOrganizations((prev) => prev.map((org) => (org.id === updatedData.id ? updatedData : org)));
	};

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		if (org_id) setCurrentOrganization(getCurrentOrganization());
		else setCurrentOrganization(undefined);
	}, [getCurrentOrganization, org_id, organizations]);

	return (
		<OrganizationsContext.Provider
			value={{ organizations, getCurrentOrganization, updateCurrentOrganization, currentOrganization }}
		>
			{children}
		</OrganizationsContext.Provider>
	);
}

export const useOrganizations = () => useContext(OrganizationsContext);
