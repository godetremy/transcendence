import styles from './components.module.scss';
import { useRef, useState } from 'react';
import { get } from '@/lib/fetcher';
import { Loader } from '@/components/globals/Loader/Loader';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import { PublicUser } from '@/types/User';
import { EmptyState } from '@/components/globals/EmptyState/EmptyState';
import ListItem from '@/components/globals/ListItem/ListItem';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { PaginationResponse } from '@/types/PaginationResponse';
import Image from 'next/image';
import { inviteOrganizationMembers } from '@/lib/fetcher/organization';
import { useMutation } from '@tanstack/react-query';
import { CardHeaderPermissionPicker } from '@/components/globals/CardHeaderPermissionPicker/CardHeaderPermissionPicker';

function OrganizationAddMemberDialog({ close }: { close: () => void }) {
	const organizationCtx = useOrganizations();
	const organization = organizationCtx.getCurrentOrganization()!;

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const [addingMembers, setAddingMembers] = useState(false);

	const [membersSelection, setMembersSelection] = useState<string[]>([]);
	const [loadingMember, setLoadingMember] = useState(false);
	const [members, setMembers] = useState<PublicUser[]>([]);

	const [hasSearch, setHasSearch] = useState(false);
	const invites = useMutation(inviteOrganizationMembers(organization.id));

	const fetchMembers = (query: string) => {
		setLoadingMember(true);
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		if (query.trim().length === 0) {
			setHasSearch(false);
			setLoadingMember(false);
			return;
		}
		setHasSearch(true);
		timeoutRef.current = setTimeout(() => {
			get<PaginationResponse<PublicUser>>(
				`/organization/${organization.id}/users?register=false&q=${encodeURI(query.trim())}`
			)
				.then((res) => setMembers(res.data))
				.finally(() => {
					setLoadingMember(false);
					if (timeoutRef.current !== null) {
						clearTimeout(timeoutRef.current);
						timeoutRef.current = null;
					}
				});
		}, 800);
	};

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
			/>
			<section className={styles.searchbar}>
				<input
					type={'text'}
					placeholder={'Rechercher un compte...'}
					onChange={(e) => {
						fetchMembers(e.target.value);
					}}
					disabled={addingMembers}
				/>
			</section>
			<main>
				<div
					className={styles.result_container}
					style={{ pointerEvents: addingMembers ? 'none' : 'auto', opacity: addingMembers ? 0.5 : 1 }}
				>
					{loadingMember ? (
						<Loader size={24} />
					) : (
						<>
							{!members || members.length === 0 ? (
								<EmptyState
									title={hasSearch ? 'Aucun résultats' : 'Fait une recherche pour commencer'}
									description={
										"Entre le nom ou l'adresse e-mail d'un de tes camarades pour l'ajouter."
									}
								/>
							) : (
								<ListContainer>
									{members.map((member, i) => (
										<ListItem
											key={i}
											title={member.full_name ?? member.id}
											description={formatDescription(member.created_at)}
											last={i === members.length - 1}
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
									))}
								</ListContainer>
							)}
						</>
					)}
				</div>
			</main>
		</section>
	);
}

export default OrganizationAddMemberDialog;
