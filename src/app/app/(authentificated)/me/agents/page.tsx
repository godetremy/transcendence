'use client';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/globals/Loader/Loader';
import { get, patch } from '@/lib/fetcher';
import { PaginationResponse } from '@/types/PaginationResponse';
import { EmptyState } from '@/components/globals/EmptyState/EmptyState';
import { AgentRequest } from '@/types/User';

function InviteActions({ request, onResult }: { request: AgentRequest; onResult: (id: string) => void }) {
	const [loading, setLoading] = useState(false);

	const sendAction = (approve: boolean) => {
		setLoading(true);
		patch<{ success: boolean; message?: string }>(`/users/approval/${request.id}`, { approve }).then((res) => {
			setLoading(false);
			if (res.success) onResult(request.id);
		});
	};

	return (
		<div className={styles.invite_actions_container}>
			{loading ? (
				<Loader size={28} />
			) : (
				<>
					<div role={'button'} onClick={() => sendAction(false)} className={styles.action}>
						<X size={22} />
					</div>
					<div role={'button'} onClick={() => sendAction(true)} className={styles.action}>
						<Check size={22} />
					</div>
				</>
			)}
		</div>
	);
}

export default function Page() {
	const [loading, setLoading] = useState(true);
	const [approvalRequest, setApprovalRequest] = useState<AgentRequest[]>([]);

	useEffect(() => {
		get<PaginationResponse<AgentRequest>>(`/users/approval/pending`).then((res) => {
			setApprovalRequest(res.data);
			setLoading(false);
		});
	}, []);

	return (
		<NavigationBarHeader title={'Demandes d’accès agents'}>
			<article className={styles.section}>
				<span className={styles.listSectionTitle}>Demande en cours</span>
				{approvalRequest.length === 0 && !loading ? (
					<EmptyState />
				) : (
					<section className={styles.list}>
						{approvalRequest?.map((request, i) => (
							<ListItem
								key={i}
								title={request.full_name ?? request.id}
								description={request.reason ?? "Aucune raison n'as été soumise."}
								showChevron={false}
								hoverEffect={false}
								rightElement={
									<InviteActions
										request={request}
										onResult={(id: string) => {
											setApprovalRequest((prev) => prev.filter((v) => v.id !== id));
										}}
									/>
								}
								last={i === approvalRequest.length - 1}
							/>
						))}
					</section>
				)}
				{loading && <Loader />}
			</article>
		</NavigationBarHeader>
	);
}
