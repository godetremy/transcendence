'use client';
import { createContext, ReactNode, useContext } from 'react';

const UploadTokenContext = createContext<{
	token: string;
	uploadFiles: (
		files: File | Blob,
		onProgress: (progress: number) => void
	) => Promise<{ name: string; size: number }>;
}>({
	uploadFiles() {
		throw 'Not implemented at this state.';
	},
	token: '',
});

export function UploadTokenProvider({ children, token }: { children: ReactNode; token: string }) {
	const triggerUploadWarning = (e: BeforeUnloadEvent) => {
		e.preventDefault();
		e.returnValue = '';
	};

	const uploadFiles = async (
		file: File | Blob,
		onProgress: (progress: number) => void
	): Promise<{ name: string; size: number }> => {
		return new Promise((resolve, reject) => {
			const formData = new FormData();

			formData.append('file', file, crypto.randomUUID());

			const xhr = new XMLHttpRequest();

			xhr.upload.addEventListener('progress', (e) => {
				if (e.lengthComputable) {
					const progress = e.loaded / e.total;
					onProgress(progress);
				}
			});

			xhr.onload = () => {
				window.removeEventListener('beforeunload', triggerUploadWarning);
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve(JSON.parse(xhr.responseText));
				} else {
					reject(new Error(`Upload failed (${xhr.status})`));
				}
			};

			xhr.onerror = () => reject(new Error('Network error'));

			xhr.open('POST', '/app/api/upload/');
			xhr.setRequestHeader('Authorization', `Bearer ${token}`);
			xhr.send(formData);
			window.addEventListener('beforeunload', triggerUploadWarning);
		});
	};

	return <UploadTokenContext.Provider value={{ token, uploadFiles }}>{children}</UploadTokenContext.Provider>;
}

export const useUpload = () => useContext(UploadTokenContext);
