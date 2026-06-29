import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { AccpetInvitation, getOrganizationInvites } from '@/lib/fetcher/organization';
import { Loader } from '@/components/globals/Loader/Loader';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import { useState } from 'react';
import styles from './page.module.scss';
import { Check, X } from 'lucide-react';
import { ListSectionTitle } from '@/components/globals/ListSectionTitle/ListSectionTitle';

function InviteActions({ org_id }: { org_id: string }) {
	const [loading, setLoading] = useState(false);
	const invite = useMutation(AccpetInvitation(org_id));
	const sendAction = (accept: boolean) => {
		setLoading(true);
		invite.mutate({ accept });
		setLoading(false);
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

export function OrganizationInvitesList() {
	const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery(getOrganizationInvites());

	if (data && data.pages[0].data.length === 0) return null;

	const formatDate = (date: string) => {
		const d = new Date(date);
		return `Invitation reçu le ${d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}`;
	};

	return (
		<>
			<ListSectionTitle>Invitations</ListSectionTitle>
			{isLoading ? (
				<Loader />
			) : isError || data === undefined ? (
				<ErrorState error={error} />
			) : (
				<ListContainer>
					{data.pages.map((row) =>
						row.data.map((invitation, i) => (
							<ListItem
								key={i}
								title={invitation.organization.name}
								description={formatDate(invitation.invited_at)}
								showChevron={false}
								hoverEffect={false}
								leftElement={
									<div
										style={{
											width: 8,
											height: 8,
											backgroundColor: 'var(--color-primary-pink)',
											borderRadius: 10,
										}}
									/>
								}
								rightElement={<InviteActions org_id={invitation.organization.id} />}
								last={i === data.pages.length - 1}
							/>
						))
					)}
				</ListContainer>
			)}
			{isFetchingNextPage && <Loader />}

			{hasNextPage && (
				<button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
					{isFetchingNextPage ? 'Chargement...' : 'Voir la suite'}
				</button>
			)}
		</>
	);
}
