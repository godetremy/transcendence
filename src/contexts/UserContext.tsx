'use client';
import { User } from '@/types/User';
import { createContext, ReactNode, useContext, useState } from 'react';

export interface UserContextType extends User {
	update: (updatedData: User) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export interface UserProviderProps {
	children: ReactNode;
	user: User;
}

export function UserProvider({ children, user: initialUser }: UserProviderProps) {
	const [user, setUser] = useState<User>(initialUser);

	const update = (updatedData: User) => {
		setUser((prev) => ({ ...prev, ...updatedData }));
	};

	return <UserContext.Provider value={{ ...user, update }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
