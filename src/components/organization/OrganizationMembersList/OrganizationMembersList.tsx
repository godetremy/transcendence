import { useInfiniteQuery } from '@tanstack/react-query';
import { getOrganizationMembers } from '@/lib/fetcher/organization';
import { Loader } from '@/components/globals/Loader/Loader';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import { OrganizationMembers } from '@/types/OrganizationMembers';
import Image from 'next/image';
import styles from '@/app/app/(authentificated)/organization/[org_id]/settings/members/page.module.scss';

export function OrganizationMembersList({
	org_id,
	onPressItem,
}: {
	org_id: string;
	onPressItem: (member: OrganizationMembers) => void;
}) {
	const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
		getOrganizationMembers(org_id)
	);

	if (isLoading) return <Loader />;
	if (isError || data === undefined) return <ErrorState error={error} />;

	const formatMembersDescription = (member: OrganizationMembers<{ permission: true }>) => {
		const invited_at = new Date(member.invited_at);
		const registred_at = new Date(member.registered_at);

		const permission = member.permission?.name ?? 'Aucune permission';

		return `${permission} • ${member.approved ? `A rejoins le ${registred_at.toLocaleDateString()}` : `Invité le ${invited_at.toLocaleDateString()}`}`;
	};

	return (
		<div>
			<ListContainer>
				{data.pages.map((row) =>
					row.data.map((member, i) => (
						<ListItem
							key={i}
							title={member.user!.full_name ?? member.user!.id}
							description={formatMembersDescription(member)}
							leftElement={
								<Image
									src={member.user!.profile_picture}
									width={40}
									height={40}
									alt={`Photo de ${member.user!.full_name ?? member.id}`}
									className={styles.profilePicture}
								/>
							}
							last={i == row.data.length - 1}
							onPress={() => onPressItem(member)}
						/>
					))
				)}
			</ListContainer>
			{isFetchingNextPage && <p>Chargement...</p>}

			{hasNextPage && (
				<button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
					{isFetchingNextPage ? 'Chargement...' : 'Voir la suite'}
				</button>
			)}
		</div>
	);
}
