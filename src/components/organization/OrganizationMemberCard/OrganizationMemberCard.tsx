import styles from './component.module.scss';
import { CardHeader } from '@/components/globals/CardHeader/CardHeader';
import { OrganizationMembers } from '@/types/OrganizationMembers';
import Image from 'next/image';
import { OrganizationPermissionSelector } from '@/components/organization/OrganizationPermissionSelector/OrganizationPermissionSelector';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteOrganizationMember, getOrganizationMemberById } from '@/lib/fetcher/organization';
import { Loader } from '@/components/globals/Loader/Loader';
import { ErrorState } from '@/components/globals/ErrorState/ErrorState';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';

export function OrganizationMemberCard({
	member,
	close,
}: {
	member: OrganizationMembers<{ user: true; permission: true }>;
	close: () => void;
}) {
	const organizationCtx = useOrganizations();
	const organization = organizationCtx.getCurrentOrganization()!;

	const { openModal, closeModal } = useModal();
	const { data, isLoading, isError, error } = useQuery(getOrganizationMemberById(organization.id, member.user.id));
	const leave = useMutation(deleteOrganizationMember(organization.id, member.user!.id));

	const formatJoinSubtitle = (member: OrganizationMembers) => {
		const invited_at = new Date(member.invited_at);
		const registred_at = new Date(member.registered_at);

		return `${member.approved ? `A rejoins le ${registred_at.toLocaleDateString()}` : `Invité le ${invited_at.toLocaleDateString()}`}`;
	};

	return (
		<div className={styles.container}>
			<CardHeader title={'Membre'} onClose={close} />
			<main>
				<section className={styles.profile_container}>
					<Image
						src={member.user!.profile_picture}
						alt={`Photo de ${member.user!.full_name ?? member.user!.id}`}
						width={100}
						height={100}
					/>
					<div>
						<h1>{member.user!.full_name ?? member.user!.id}</h1>
						<h2>{formatJoinSubtitle(member)}</h2>
					</div>
				</section>
				{isLoading && <Loader />}
				{isError && <ErrorState error={error} />}
				{data && (
					<>
						<span>Rôle</span>
						<OrganizationPermissionSelector
							selectedPermId={data.permission?.id ?? ''}
							orgId={organization.id}
							userId={member.user!.id}
						/>
						<ListContainer>
							<ListItem title={"Retirer de l'organisation"} negative last onPress={() => {
								openModal({
									title: 'Tu veux vraiment le retirer ?',
									message: 'Cette personne pourra toujours être réinvité',
									buttons: [
										{ text: 'Non', onClick: closeModal },
										{ text: 'Supprimer', negative: true, onClick: () => {
											leave.mutate({ user_id: data.user.id});
											closeModal();
											close();
										}}
									]
								})
							}} />
						</ListContainer>
					</>
				)}
			</main>
		</div>
	);
}
