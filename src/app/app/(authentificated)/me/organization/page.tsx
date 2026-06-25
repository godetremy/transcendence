'use client';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import styles from './page.module.scss';
import ListItem from '@/components/globals/ListItem/ListItem';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/globals/Loader/Loader';
import { get, put } from '@/lib/fetcher';
import { useUser } from '@/contexts/UserContext';
import { OrganizationInvitation } from '@/types/OrganizationMembers';
import { PaginationResponse } from '@/types/PaginationResponse';
import { EmptyState } from '@/components/globals/EmptyState/EmptyState';
import { PublicOrganization } from '@/types/Organization';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/globals/Card/Card';
import OrganizationCreateDialog from '@/components/organization/OrganizationCreateDialog/OrganizationCreateDialog';

function InviteActions({
	org_id,
	id,
	onResult,
}: {
	org_id: string;
	id: string;
	onResult: (id: string, accept: boolean) => void;
}) {
	const [loading, setLoading] = useState(false);

	const sendAction = (accept: boolean) => {
		setLoading(true);
		put<{ success: boolean; message?: string }>(`/organization/${org_id}/members/invite`, { accept }).then(
			(res) => {
				setLoading(false);
				if (res.success) onResult(id, accept);
			}
		);
	};

	return (
		<div className={styles.invite_actions_container}>
			{loading ? (
				<Loader size={28} />
			) : (
				<>
					<div role={'button'} onClick={() => sendAction(false)} className={styles.action}>
						<X size={22} />
					</div>
					<div role={'button'} onClick={() => sendAction(true)} className={styles.action}>
						<Check size={22} />
					</div>
				</>
			)}
		</div>
	);
}

export default function Page() {
	const user = useUser();
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [organizations, setOrganizations] = useState<PublicOrganization[] | undefined>(undefined);

	const [invitations, setInvitations] = useState<OrganizationInvitation[] | undefined>(undefined);
	const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);

	const fetchOrganisation = async (page: number) => {
		const res = await get<PublicOrganization[]>(`/organization/mine?page=${page}`);
		setOrganizations(res);
	};

	const fetchInvitation = async (page: number) => {
		const res = await get<PaginationResponse<OrganizationInvitation>>(
			`/organization/invitation/pending?page=${page}`
		);
		setInvitations((prev) => {
			if (prev === undefined) return res.data;
			return [...prev, ...res.data];
		});
	};

	const formatDate = (date: string) => {
		const d = new Date(date);
		return `Invitation reçu le ${d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}`;
	};

	useEffect(() => {
		const load = async () => {
			await Promise.all([fetchOrganisation(0), fetchInvitation(0)]);

			setLoading(false);
		};

		load();
	}, []);

	return (
		<NavigationBarHeader title={'Organisations'}>
			<article className={styles.section}>
				{user?.admin && (
					<>
						<span className={styles.listSectionTitle}>Administrateur</span>
						<section className={styles.list}>
							<ListItem
								title={'Créer une nouvelle organisation'}
								onPress={() => setShowCreateDialog(true)}
								last
							/>
						</section>
					</>
				)}

				<span className={styles.listSectionTitle}>Mes organisations</span>
				{invitations && organizations && (
					<>
						{invitations.length === 0 && organizations?.length === 0 && !loading ? (
							<EmptyState />
						) : (
							<section className={styles.list}>
								{invitations?.map((invitation, i) => (
									<ListItem
										key={i}
										title={invitation.organization.name}
										description={formatDate(invitation.invited_at)}
										showChevron={false}
										hoverEffect={false}
										leftElement={
											<div
												style={{
													width: 8,
													height: 8,
													backgroundColor: 'var(--color-primary-pink)',
													borderRadius: 10,
												}}
											/>
										}
										rightElement={
											<InviteActions
												org_id={invitation.organization.id}
												id={invitation.id}
												onResult={(id: string, accept: boolean) => {
													if (accept) {
														const org = invitations.find((o) => o.id === id);
														if (org)
															setOrganizations((prev) => [
																org.organization,
																...(prev ?? []),
															]);
													}
													setInvitations((prev) => prev!.filter((v) => v.id !== id));
												}}
											/>
										}
										last={i === invitations.length - 1 && organizations.length === 0}
									/>
								))}
								{organizations?.map((organization, i) => (
									<ListItem
										key={i}
										title={organization.name}
										description={organization.description ?? 'Aucune description'}
										last={i === organizations.length - 1}
										onPress={() => router.push(`/app/organization/${organization.id}/dashboard`)}
									/>
								))}
							</section>
						)}
					</>
				)}
				{loading && <Loader />}
			</article>
			<Card visible={showCreateDialog} requestClose={() => setShowCreateDialog(false)}>
				<OrganizationCreateDialog close={() => setShowCreateDialog(false)} />
			</Card>
		</NavigationBarHeader>
	);
}
