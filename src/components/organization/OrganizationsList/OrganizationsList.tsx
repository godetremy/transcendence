import { useInfiniteQuery } from '@tanstack/react-query';
import { getOrganizations } from '@/lib/fetcher/organization';
import { Loader } from '@/components/globals/Loader/Loader';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import { useRouter } from 'next/navigation';

export function OrganizationsList({}: {}) {
	const router = useRouter();
	const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery(getOrganizations());

	if (isLoading) return <Loader />;
	if (isError || data === undefined) return <ErrorState error={error} />;

	return (
		<div>
			<ListContainer>
				{data.pages.map((row) =>
					row.data.map((organization, i) => (
						<ListItem
							key={i}
							title={organization.name}
							description={organization.description ?? 'Aucune description'}
							last={i === data.pages.length - 1}
							onPress={() => router.push(`/app/organization/${organization.id}/dashboard`)}
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
