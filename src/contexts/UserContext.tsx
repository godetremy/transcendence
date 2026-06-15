'use client';
import { User } from '@/types/User';
import { createContext, ReactNode, useContext } from 'react';

const UserContext = createContext<User | null>(null);

export interface UserProviderProps {
	children: ReactNode;
	user: User;
}

export function UserProvider({ children, user }: UserProviderProps) {
	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
