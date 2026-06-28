import { useInfiniteQuery } from '@tanstack/react-query';
import { getOrganizationPermissions } from '@/lib/fetcher/organization';
import { Loader } from '@/components/globals/Loader/Loader';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import { OrganizationPermissionDetails } from '@/types/OrganizationPermissionDetails';

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

	return (
		<ListContainer>
			{data.pages.map((row) =>
				row.data.map((perm, i) => (
					<ListItem
						key={i}
						title={perm.name}
						description={perm.description ?? 'Aucune description'}
						last={i == row.data.length - 1}
						onPress={() => onPressItem(perm)}
					/>
				))
			)}
			{isFetchingNextPage && <p>Chargement...</p>}

			{hasNextPage && (
				<button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
					{isFetchingNextPage ? 'Chargement...' : 'Voir la suite'}
				</button>
			)}
		</ListContainer>
	);
}
