import { useInfiniteQuery } from '@tanstack/react-query';
import { getOrganizations } from '@/lib/fetcher/organization';
import { Loader } from '@/components/globals/Loader/Loader';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { EmptyState } from '@/components/globals/EmptyState/EmptyState';
import { ShowMoreButton } from '@/components/globals/ShowMoreButton/ShowMoreButton';

export function OrganizationsList() {
	const router = useRouter();
	const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery(getOrganizations());

	if (isLoading) return <Loader />;
	if (isError || data === undefined) return <ErrorState error={error} />;
	if (data.pages[0].data.length === 0)
		return <EmptyState description={"Tu n'as aucune organisation pour l'instant. Et si tu crées ta première ?"} />;

	return (
		<>
			<ListContainer>
				{data.pages.map((row) =>
					row.data.map((organization, i) => (
						<ListItem
							key={i}
							title={organization.name}
							description={organization.description ?? 'Aucune description'}
							leftElement={
								<Image
									src={organization.logo}
									width={35}
									height={35}
									alt={`${organization.name} logo`}
									style={{ borderRadius: 5, border: '1px solid var(--color-border-dark)' }}
								/>
							}
							last={i === row.data.length - 1}
							onPress={() => router.push(`/app/organization/${organization.id}/dashboard`)}
						/>
					))
				)}
			</ListContainer>
			{isFetchingNextPage && <p>Chargement...</p>}
			{hasNextPage && <ShowMoreButton onClick={fetchNextPage} loading={isFetchingNextPage} />}
		</>
	);
}
