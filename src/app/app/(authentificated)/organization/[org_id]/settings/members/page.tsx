'use client';
import styles from './page.module.scss';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, TargetAndTransition } from 'motion/react';
import ListItem from '@/components/globals/ListItem/ListItem';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import { Loader } from '@/components/globals/Loader/Loader';
import { get } from '@/lib/fetcher';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { PaginationResponse } from '@/types/PaginationResponse';
import { OrganizationMembers } from '@/types/OrganizationMembers';
import Image from 'next/image';

export default function Page() {
	const organizationCtx = useOrganizations();
	const organization = organizationCtx.getCurrentOrganization()!;

	const [selectedTab, setSelectedTab] = useState(0);

	const [membersLoading, setMembersLoading] = useState(true);
	const [members, setMembers] = useState<OrganizationMembers[]>([]);
	const [membersPage, setMembersPage] = useState(1);
	const [membersHasMore, setMembersHasMore] = useState(true);

	const animation_picker_initial = (inverted: boolean): TargetAndTransition => ({
		translateX: 20 * (inverted ? -1 : 1),
		opacity: 0,
		transition: { duration: 0.2 },
	});
	const animation_picker_animate: TargetAndTransition = { translateX: 0, opacity: 1, transition: { duration: 0.2 } };

	const fetchMembers = () => {
		get<PaginationResponse<OrganizationMembers>>(`/organization/${organization.id}/members?page=${membersPage}`)
			.then((res) => {
				setMembers((prev) => [...prev, ...res.data]);
				setMembersHasMore(res.total_pages > membersPage + 1);
				setMembersPage((prev) => prev + 1);
			})
			.catch((err) => console.log(err))
			.finally(() => setMembersLoading(false));
	};

	const formatMembersDescription = (member: OrganizationMembers) => {
		const invited_at = new Date(member.invited_at);
		const registred_at = new Date(member.registered_at);

		const permission = member.permission?.name ?? 'Aucune permission';

		return `${permission} • ${member.approved ? `A rejoins le ${registred_at.toLocaleDateString()}` : `Invité le ${invited_at.toLocaleDateString()}`}`;
	};

	useEffect(() => {
		fetchMembers();
	}, [fetchMembers]);

	return (
		<NavigationBarHeader title={'Membres et permissions'}>
			<div className={`${styles.page_switcher} ${selectedTab == 1 ? styles.active : ''}`}>
				<button onClick={() => setSelectedTab(0)} className={selectedTab === 0 ? styles.active : undefined}>
					Membres
				</button>
				<button onClick={() => setSelectedTab(1)} className={selectedTab === 1 ? styles.active : undefined}>
					Permissions
				</button>
			</div>

			<div className={styles.page_container}>
				<AnimatePresence mode="wait">
					{selectedTab === 0 ? (
						<motion.section
							className={styles.page}
							initial={animation_picker_initial(true)}
							exit={animation_picker_initial(true)}
							animate={animation_picker_animate}
							key={'members_page'}
						>
							<ListContainer>
								{members.map((member, i) => (
									<ListItem
										key={i}
										title={member.user!.full_name ?? member.id}
										description={formatMembersDescription(member)}
										leftElement={
											<Image
												src={member.user!.profile_picture}
												width={40}
												height={40}
												alt={`Photo de ${member.user!.full_name ?? member.id}`}
												className={styles.profilePicture}
											/>
										}
										showChevron={false}
										last={i == members.length - 1}
									/>
								))}
							</ListContainer>

							{membersLoading ? <Loader /> : membersHasMore && <button>Charger plus</button>}
						</motion.section>
					) : (
						<motion.section
							className={styles.page}
							initial={animation_picker_initial(false)}
							exit={animation_picker_initial(false)}
							animate={animation_picker_animate}
							key={'permission_page'}
						>
							<p>Permission</p>
							<ListItem title={'Demo'} />
						</motion.section>
					)}
				</AnimatePresence>
			</div>
		</NavigationBarHeader>
	);
}
