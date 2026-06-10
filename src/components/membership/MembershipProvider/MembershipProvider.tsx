'use client';
import { createContext, ReactNode, useContext, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { MembershipCard } from '@/components/membership/MembershipCard/MembershipCard';

type MembershipContextType = {
	showCard: () => void;
	hideCard: () => void;
};

const MembershipContext = createContext<MembershipContextType | null>(null);

export function MembershipProvider({ children }: { children: ReactNode }) {
	const [visible, setVisible] = useState<boolean>(false);

	const showCard = () => setVisible(true);
	const hideCard = () => setVisible(false);

	return (
		<MembershipContext.Provider value={{ showCard, hideCard }}>
			{children}

			<AnimatePresence>{visible && <MembershipCard requestClose={hideCard} />}</AnimatePresence>
		</MembershipContext.Provider>
	);
}

export function useMembership() {
	const ctx = useContext(MembershipContext);
	if (!ctx) throw new Error('useMembership must be used inside MembershipContext');
	return ctx;
}
