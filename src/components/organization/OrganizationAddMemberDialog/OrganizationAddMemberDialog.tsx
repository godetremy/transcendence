import styles from './components.module.scss';
import { useRef, useState } from 'react';
import { Loader } from '@/components/globals/Loader/Loader';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import { EmptyState } from '@/components/globals/EmptyState/EmptyState';
import ListItem from '@/components/globals/ListItem/ListItem';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import Image from 'next/image';
import { getOrganizationNotMembers, inviteOrganizationMembers } from '@/lib/fetcher/organization';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { CardHeaderPermissionPicker } from '@/components/globals/CardHeaderPermissionPicker/CardHeaderPermissionPicker';
import { ShowMoreButton } from '@/components/globals/ShowMoreButton/ShowMoreButton';

function OrganizationAddMemberDialog({ close }: { close: () => void }) {
	const organizationCtx = useOrganizations();
	const organization = organizationCtx.getCurrentOrganization()!;

	const [addingMembers, setAddingMembers] = useState(false);
	const [membersSelection, setMembersSelection] = useState<string[]>([]);
	const [search, setSearch] = useState('');

	const invites = useMutation(inviteOrganizationMembers(organization.id));
	const hasSearch = search.trim().length > 0;

	const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
		...getOrganizationNotMembers(organization.id, search),
		enabled: hasSearch,
	});

	const addMembers = (perm_id: string) => {
		setAddingMembers(true);
		invites.mutate({ permission_id: perm_id, members: membersSelection });
		close();
	};

	const includeId = (id: string) => {
		return membersSelection.includes(id);
	};

	const formatDescription = (str: string) => {
		const date = new Date(str);
		return `Inscrit depuis le ${date.toLocaleDateString()}`;
	};

	return (
		<section className={styles.container}>
			<CardHeaderPermissionPicker
				orgId={organization.id}
				title={'Ajouter des membres'}
				loading={addingMembers}
				onAccept={addMembers}
				disabledAccept={membersSelection.length === 0}
				close={close}
			/>
			<section className={styles.searchbar}>
				<input
					type={'text'}
					placeholder={'Rechercher un compte...'}
					onChange={(e) => {
						setSearch(e.target.value);
					}}
					disabled={addingMembers}
				/>
			</section>
			<main>
				<div
					className={styles.result_container}
					style={{ pointerEvents: addingMembers ? 'none' : 'auto', opacity: addingMembers ? 0.5 : 1 }}
				>
					{isLoading ? (
						<Loader size={24} />
					) : (
						<>
							{!data || data.pages[0].data.length === 0 ? (
								<EmptyState
									title={hasSearch ? 'Aucun résultats' : 'Fait une recherche pour commencer'}
									description={
										"Entre le nom ou l'adresse e-mail d'un de tes camarades pour l'ajouter."
									}
								/>
							) : (
								<ListContainer>
									{data.pages.map((row, j) =>
										row.data.map((member, i) => (
											<ListItem
												key={i}
												title={member.full_name ?? member.id}
												description={formatDescription(member.created_at)}
												last={i == row.data.length - 1 && data.pages.length - 1 === j}
												leftElement={
													<Image
														src={member.profile_picture}
														width={40}
														height={40}
														alt={`Photo de ${member.full_name ?? member.id}`}
														className={styles.profilePicture}
													/>
												}
												rightElement={
													<label
														htmlFor={`valid_id_${member.id}`}
														className={styles.checkbox_label}
													>
														<input
															id={`valid_id_${member.id}`}
															type={'checkbox'}
															className={styles.checkbox}
															onChange={(e) => {
																if (e.currentTarget.checked)
																	setMembersSelection((prev) => [...prev, member.id]);
																else
																	setMembersSelection((prev) =>
																		prev.filter((v) => v !== member.id)
																	);
															}}
															checked={includeId(member.id)}
														/>
													</label>
												}
												showChevron={false}
											/>
										))
									)}
								</ListContainer>
							)}
						</>
					)}
					{hasNextPage && <ShowMoreButton onClick={() => fetchNextPage()} loading={isFetchingNextPage} />}
				</div>
			</main>
		</section>
	);
}

export default OrganizationAddMemberDialog;
