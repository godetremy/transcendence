import { useQuery } from '@tanstack/react-query';
import { getOrganizationPermission } from '@/lib/fetcher/organization';
import { Loader } from '@/components/globals/Loader/Loader';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';

export function OrganizationPermissionList({ org_id }: { org_id: string }) {
	const { data, isLoading, isError, error } = useQuery(getOrganizationPermission(org_id));

	if (isLoading) return <Loader />;
	if (isError || data === undefined) return <ErrorState error={error} />;

	return (
		<ListContainer>
			{data.data.map((perm, i) => (
				<ListItem
					key={i}
					title={perm.name}
					description={perm.description ?? 'Aucune description'}
					last={i == data.data.length - 1}
					onPress={() => {}}
				/>
			))}
		</ListContainer>
	);
}
