import { useInfiniteQuery } from '@tanstack/react-query';
import { getOrganizationFollowers } from '@/lib/fetcher/organization';
import { Loader } from '@/components/globals/Loader/Loader';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import Image from 'next/image';
import styles from '@/app/app/(authentificated)/organization/[org_id]/settings/members/page.module.scss';

export function OrganizationFollowersList({ org_id }: { org_id: string }) {
	const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
		getOrganizationFollowers(org_id)
	);

	if (isLoading) return <Loader />;
	if (isError || data === undefined) return <ErrorState error={error} />;

	return (
		<div>
			<ListContainer>
				{data.pages.map((row) =>
					row.data.map((follower, i) => (
						<ListItem
							key={i}
							title={follower.user!.full_name ?? follower.user!.id}
							leftElement={
								<Image
									src={follower.user!.profile_picture}
									width={40}
									height={40}
									alt={`Photo de ${follower.user!.full_name ?? follower.id}`}
									className={styles.profilePicture}
								/>
							}
							last={i == row.data.length - 1}
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
