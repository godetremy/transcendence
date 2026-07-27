import { useInfiniteQuery } from '@tanstack/react-query';
import { getOrganizationPermissions } from '@/lib/fetcher/organization';
import { Loader } from '@/components/globals/Loader/Loader';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import { OrganizationPermissionDetails } from '@/types/OrganizationPermissionDetails';
import { ShowMoreButton } from '@/components/globals/ShowMoreButton/ShowMoreButton';
import { EmptyState } from '@/components/globals/EmptyState/EmptyState';

export function OrganizationPermissionList({
	org_id,
	onPressItem,
}: {
	org_id: string;
	onPressItem: (permission: OrganizationPermissionDetails) => void;
}) {
	const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
		getOrganizationPermissions(org_id)
	);

	if (isLoading) return <Loader />;
	if (isError || data === undefined) return <ErrorState error={error} />;
	if (data.pages.length === 0 || data.pages[0].data.length === 0)
		return (
			<EmptyState
				title={'Aucune permission'}
				description={"Bravo, tu as tout supprimés... Si tu en crée d'autres désormais ?"}
			/>
		);

	return (
		<>
			<ListContainer>
				{data.pages.map((row, j) =>
					row.data.map((perm, i) => (
						<ListItem
							key={i}
							title={perm.name}
							description={perm.description ?? 'Aucune description'}
							last={i == row.data.length - 1 && data.pages.length - 1 === j}
							onPress={() => onPressItem(perm)}
						/>
					))
				)}
			</ListContainer>
			{hasNextPage && <ShowMoreButton onClick={() => fetchNextPage()} loading={isFetchingNextPage} />}
		</>
	);
}
