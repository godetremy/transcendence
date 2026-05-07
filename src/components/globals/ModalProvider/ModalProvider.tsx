'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Modal } from '@/components/globals/Modal/Modal';
import { AnimatePresence } from 'motion/react';

type ModalButtonOptions = {
	text: string;
	onClick?: () => void;
	negative?: boolean;
};

export type ModalOptions = {
	title: string;
	message?: string;
	buttons: ModalButtonOptions[];
	canClose?: boolean;
};

type ModalContextType = {
	openModal: (options: ModalOptions) => void;
	closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
	const [modal, setModal] = useState<ModalOptions | null>(null);

	const openModal = (options: ModalOptions) => setModal(options);
	const closeModal = () => setModal(null);

	return (
		<ModalContext.Provider value={{ openModal, closeModal }}>
			{children}

			<AnimatePresence>{modal && <Modal {...modal} close={closeModal} />}</AnimatePresence>
		</ModalContext.Provider>
	);
}

export function useModal() {
	const ctx = useContext(ModalContext);
	if (!ctx) throw new Error('useModal must be used inside ModalProvider');
	return ctx;
}
