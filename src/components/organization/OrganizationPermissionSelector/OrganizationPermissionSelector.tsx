import { useMutation, useQuery } from '@tanstack/react-query';
import { getOrganizationPermission, updateOrganizationUserPermission } from '@/lib/fetcher/organization';
import { Loader } from '@/components/globals/Loader/Loader';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import styles from '@/components/organization/OrganizationAddMemberDialog/components.module.scss';

export function OrganizationPermissionSelector({
	selectedPermId,
	orgId,
	userId,
}: {
	selectedPermId: string;
	orgId: string;
	userId: string;
}) {
	const { data, isLoading, isError, error } = useQuery(getOrganizationPermission(orgId));
	const update = useMutation(updateOrganizationUserPermission(orgId, userId));

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
					showChevron={false}
					rightElement={
						<label htmlFor={`check_${perm.id}`} className={styles.checkbox_label}>
							<input
								id={`check_${perm.id}`}
								type={'checkbox'}
								className={styles.checkbox}
								onChange={(e) => (e.target.checked ? update.mutate({ perm_id: perm.id }) : {})}
								checked={selectedPermId === perm.id}
							/>
						</label>
					}
				/>
			))}
		</ListContainer>
	);
}
