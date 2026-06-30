import styles from './component.module.scss';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getOrganizationFollowers } from '@/lib/fetcher/organization';
import { Loader } from '@/components/globals/Loader/Loader';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import Image from 'next/image';

export function OrganizationFollowersList({ org_id }: { org_id: string }) {
	const { data, isLoading, isError, error, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
		getOrganizationFollowers(org_id)
	);

	if (isLoading) return <Loader />;
	if (isError || data === undefined) return <ErrorState error={error} />;

	return (
		<>
			<ListContainer>
				{data.pages.map((row, j) =>
					row.data.map((followers, i) => (
						<ListItem
							key={i}
							title={followers.user!.full_name ?? followers.user!.id}
							leftElement={
								<Image
									src={followers.user!.profile_picture}
									width={40}
									height={40}
									alt={`Photo de ${followers.user!.full_name ?? followers.id}`}
									className={styles.profilePicture}
								/>
							}
							last={i == row.data.length - 1 && data.pages.length - 1 === j}
						/>
					))
				)}
			</ListContainer>
			{isFetchingNextPage && <p>Chargement...</p>}

			{hasNextPage && (
				<button className={styles.next} onClick={() => {}} disabled={isFetchingNextPage}>
					{isFetchingNextPage ? 'Chargement...' : 'Voir la suite'}
				</button>
			)}
		</>
	);
}
