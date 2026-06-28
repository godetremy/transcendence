import styles from './components.module.scss';
import { Check, ChevronDown } from 'lucide-react';
import { Loader } from '@/components/globals/Loader/Loader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getOrganizationPermissions } from '@/lib/fetcher/organization';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ErrorState } from '../ErrorState/ErrorState';

export interface CardHeaderPermissionPickerProps {
	orgId: string;
	title: string;
	onAccept: (permission_id: string) => void;
	loading?: boolean;
	disabledAccept?: boolean;
}

export function CardHeaderPermissionPicker(props: CardHeaderPermissionPickerProps) {
	const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
		getOrganizationPermissions(props.orgId)
	);

	const [open, setOpen] = useState(false);
	const [selection, setSelection] = useState<string | undefined>(undefined);

	const closedContainer = { opacity: 0, scale: 0.98, translate: '0 -5px' };
	const openedContainer = { opacity: 1, scale: 1, translate: '0 0px' };

	const hiddenCheckmark = { opacity: 0, scale: 0.8 };
	const visibleCheckmark = { opacity: 1, scale: 1 };

	if (isLoading) return <Loader />;
	if (isError || data === undefined) return <ErrorState error={error} />;

	return (
		<AnimatePresence>
			<header className={styles.card_header}>
				<h1>{props.title}</h1>
				<div className={styles.picker}>
					<button
						disabled={
							props.loading ||
							isLoading ||
							data === undefined ||
							selection === undefined ||
							props.disabledAccept
						}
						onClick={() => props.onAccept(selection!)}
					>
						{isLoading || data === undefined || props.loading ? (
							<Loader size={24} />
						) : (
							<>{`Ajouter en tant que ${data.pages[0].data.find((v) => v.id === selection)?.name ?? 'sans rôle'}`}</>
						)}
					</button>
					<button onClick={() => setOpen(!open)} disabled={props.loading || isLoading || data === undefined}>
						<ChevronDown />
					</button>
				</div>

				{open && data && (
					<motion.div
						className={styles.picker_container}
						key="container"
						initial={closedContainer}
						animate={openedContainer}
						exit={closedContainer}
					>
						{data.pages.map((row) =>
							row.data.map((perm, i) => (
								<button
									key={i}
									onClick={() => {
										setSelection(perm.id);
										setOpen(false);
									}}
								>
									{selection === perm.id && (
										<motion.div
											initial={hiddenCheckmark}
											animate={visibleCheckmark}
											exit={hiddenCheckmark}
											key={`check_${perm.id}`}
										>
											<Check size={18} />
										</motion.div>
									)}
									{perm.name}
								</button>
							))
						)}
						{isFetchingNextPage && <p>Chargement...</p>}

						{hasNextPage && (
							<button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
								{isFetchingNextPage ? 'Chargement...' : 'Voir la suite'}
							</button>
						)}
					</motion.div>
				)}
			</header>
		</AnimatePresence>
	);
}
