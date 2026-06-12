'use client';
import styles from './page.module.scss';
import { ReactNode, Suspense, useState } from 'react';
import { StudentLoginPagesImages } from '@/const/StudentLoginPagesImages';
import { LoginTemplate } from '@/components/login/loginTemplate/LoginTemplate';
import { Loader } from '@/components/globals/Loader/Loader';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';
import { useRouter } from 'next/navigation';
import { ApprobationRequired } from '@/app/app/approval/pages/approbationRequired';
import { WhoAreYou } from '@/app/app/approval/pages/whoAreYou';
import { AccessMotivation } from '@/app/app/approval/pages/accessMotivation';
import { Processing } from '@/app/app/approval/pages/processing';
import {ApprobationResult} from "@/app/app/approval/pages/approbationResult";

export interface ApprovalButton {
	title: string;
	primary?: boolean;
	onPress?: () => void;
	canLoad?: boolean;
}

export interface ApprovalPage {
	content: ReactNode;
	buttons: ApprovalButton[];
}

export default function Page() {
	const router = useRouter();
	const { openModal, closeModal } = useModal();

	const [image] = useState(() => {
		return StudentLoginPagesImages[Math.floor(Math.random() * StudentLoginPagesImages.length)];
	});
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);

	const logout = () => {
		openModal({
			title: 'Se déconnecter ?',
			message: 'Vous allez être déconnecté de votre compte. Vous pourrez vous reconnecter à tout moment.',
			buttons: [
				{
					text: 'Annuler',
					onClick: closeModal,
				},
				{
					text: 'Se déconnecter',
					negative: true,
					onClick: () => {
						closeModal();
						router.push('/app/api/auth/logout');
					},
				},
			],
		});
	};

	const nextPage = () => {
		setPage((p) => p + 1);
	};

	const content: ApprovalPage[] = [
		ApprobationRequired(logout, nextPage),
		WhoAreYou(logout, nextPage, loading, setLoading),
		AccessMotivation(logout, nextPage, loading, setLoading),
		Processing(logout, nextPage),
		ApprobationResult(true, logout, nextPage),
	];

	return (
		<LoginTemplate
			background={{
				source: image.source,
				alt: image.alt,
			}}
			contentClassName={styles.main_container}
		>
			<Suspense fallback={<Loader size={60} />}>
				<div className={styles.progress_indicator_container}>
					{content.map((_, i) => (
						<div className={`${styles.bar} ${page >= i ? styles.active : ''}`} key={i} />
					))}
				</div>
				<div className={styles.pages_container}>
					{content.map((item, i) => (
						<div
							key={i}
							style={{ transform: `translateX(${page === i ? 0 : 40 * (page < i ? 1 : -1)}px)` }}
							className={`${styles.page} ${page !== i ? styles.hidden : ''}`}
						>
							{item.content}
						</div>
					))}
				</div>
				{content[page].buttons.map((button, i) => (
					<button
						key={`${content[page].buttons.length - i}`}
						onClick={button.onPress}
						className={`${styles.button} ${button.primary ? styles.primary : ''}`}
						disabled={loading}
					>
						{loading && button.canLoad && <Loader size={30} />}
						{button.title}
					</button>
				))}
			</Suspense>
		</LoginTemplate>
	);
}
