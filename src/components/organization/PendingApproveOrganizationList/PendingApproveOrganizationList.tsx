import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { approveOrganization, getPendingApproveOrganization } from '@/lib/fetcher/organization';
import { Loader } from '@/components/globals/Loader/Loader';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import { useState } from 'react';
import styles from './page.module.scss';
import { Check, X } from 'lucide-react';
import { ListSectionTitle } from '@/components/globals/ListSectionTitle/ListSectionTitle';
import { ShowMoreButton } from '@/components/globals/ShowMoreButton/ShowMoreButton';
import Image from 'next/image';
import { PrivateOrganization } from '@/types/Organization';

function InviteActions({ org_id }: { org_id: string }) {
	const [loading, setLoading] = useState(false);
	const { mutate } = useMutation(approveOrganization(org_id));

	const sendAction = (accept: boolean) => {
		setLoading(true);
		mutate({ accept });
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

export function PendingApproveOrganizationList() {
	const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
		getPendingApproveOrganization()
	);

	if (data && data.pages[0].data.length === 0) return null;

	const formatDescription = (organization: PrivateOrganization<object>) => {
		const d = new Date(organization.created_at);
		return `Crée par ${organization.owner_id} le ${d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}`;
	};

	return (
		<>
			<ListSectionTitle>Demandes d&#39;approbations d&#39;organisation</ListSectionTitle>
			{isLoading ? (
				<Loader />
			) : isError || data === undefined ? (
				<ErrorState error={error} />
			) : (
				<ListContainer>
					{data.pages.map((row, j) =>
						row.data.map((organization, i) => (
							<ListItem
								key={i}
								title={organization.name}
								description={formatDescription(organization)}
								showChevron={false}
								hoverEffect={false}
								leftElement={
									<Image
										src={organization.logo}
										width={35}
										height={35}
										alt={`${organization.name} logo`}
										style={{ borderRadius: 5, border: '1px solid var(--color-border-dark)' }}
									/>
								}
								rightElement={<InviteActions org_id={organization.id} />}
								last={i === row.data.length - 1 && j === data.pages.length - 1}
							/>
						))
					)}
				</ListContainer>
			)}
			{isFetchingNextPage && <Loader />}

			{hasNextPage && <ShowMoreButton onClick={fetchNextPage} loading={isFetchingNextPage} />}
		</>
	);
}
