'use client';
import styles from './component.module.scss';
import { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';

export enum ToastType {
	NONE = 'none',
	INFO = 'info',
	SUCCESS = 'success',
	WARNING = 'warning',
	ERROR = 'error',
}

export interface ToastOptions {
	title: string;
	message?: string;
	type?: ToastType;
}

export interface Toast extends ToastOptions {
	id: number;
	timeout?: NodeJS.Timeout;
}

export type ToastContextType = {
	showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);
	const id = useRef(0);
	const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

	const removeToast = (toastId: number) => {
		const timer = timers.current.get(toastId);
		if (timer) {
			clearTimeout(timer);
			timers.current.delete(toastId);
		}

		setToasts((prev) => prev.filter((t) => t.id !== toastId));
	};

	const setToastTimeout = (toastId: number) => {
		const timeout = setTimeout(() => {
			removeToast(toastId);
		}, 4000);

		timers.current.set(toastId, timeout);
	};

	const showToast = (options: ToastOptions) => {
		const toastId = id.current++;

		setToasts((prev) => [{ id: toastId, ...options }, ...prev]);

		setToastTimeout(toastId);
	};

	const getIcon = (type: ToastType) => {
		switch (type) {
			case ToastType.INFO:
				return '/images/info.svg';
			case ToastType.SUCCESS:
				return '/images/ok.svg';
			case ToastType.WARNING:
				return '/images/warning.svg';
			case ToastType.ERROR:
				return '/images/failure.svg';
			default:
				return '/images/info.svg';
		}
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}

			<div className={styles.toastContainer}>
				<AnimatePresence>
					{toasts.map((toast) => (
						<motion.div
							key={toast.id}
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: 10, opacity: 0, marginTop: -60, scale: 0.8 }}
							onPointerEnter={() => {
								const timer = timers.current.get(toast.id);
								if (timer) {
									clearTimeout(timer);
									timers.current.delete(toast.id);
								}
							}}
							onPointerLeave={() => {
								setToastTimeout(toast.id);
							}}
						>
							<Image src={getIcon(toast.type ?? ToastType.NONE)} alt="cone" width={30} height={30} />
							<div>
								<p>{toast.title}</p>
								<span>{toast.message}</span>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToast must be used inside ToastProvider');
	return ctx;
}
