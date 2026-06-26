'use client';
import styles from './page.module.scss';
import { NavigationBarHeader } from '@/components/globals/NavigationBarHeader/NavigationBarHeader';
import { useState } from 'react';
import { AnimatePresence, motion, TargetAndTransition } from 'motion/react';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import { OrganizationMembers } from '@/types/OrganizationMembers';
import { Plus, UserRoundPlus } from 'lucide-react';
import { Card } from '@/components/globals/Card/Card';
import OrganizationAddMemberDialog from '@/components/organization/OrganizationAddMemberDialog/OrganizationAddMemberDialog';
import { OrganizationPermissionList } from '@/components/organization/OrganizationPermissionList/OrganizationPermissionList';
import { OrganizationMembersList } from '@/components/organization/OrganizationMembersList/OrganizationMembersList';
import { OrganizationMemberCard } from '@/components/organization/OrganizationMemberCard/OrganizationMemberCard';
import { OrganizationPermissionCreateCard } from '@/components/organization/OrganizationPermissionCreateCard/OrganizationPermissionCreateCard';
import { OrganizationPermissionUpdateCard } from '@/components/organization/OrganizationPermissionUpdateCard/OrganizationPermissionUpdateCard';
import { OrganizationPermissionDetails } from '@/types/OrganizationPermissionDetails';

export default function Page() {
	const organizationCtx = useOrganizations();
	const organization = organizationCtx.getCurrentOrganization()!;

	const [selectedTab, setSelectedTab] = useState(0);

	const [showMemberCard, setShowMemberCard] = useState(false);
	const [memberCardUser, setMemberCardUser] = useState<OrganizationMembers | undefined>(undefined);
	const [permissionCardUser, setpermissionCardUser] = useState<OrganizationPermissionDetails | undefined>(undefined);

	const [showAddMemberCard, setShowAddMemberCard] = useState(false);

	const [showCreatePermissionCard, setShowCreatePermissionCard] = useState(false);
	const [showUpdatePermissionCard, setShowUpdatePermissionCard] = useState(false);

	const animation_picker_initial = (inverted: boolean): TargetAndTransition => ({
		translateX: 20 * (inverted ? -1 : 1),
		opacity: 0,
		transition: { duration: 0.2 },
	});
	const animation_picker_animate: TargetAndTransition = { translateX: 0, opacity: 1, transition: { duration: 0.2 } };

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
							<OrganizationMembersList
								org_id={organization.id}
								onPressItem={(member) => {
									setMemberCardUser(member);
									setShowMemberCard(true);
								}}
							/>
						</motion.section>
					) : (
						<motion.section
							className={styles.page}
							initial={animation_picker_initial(false)}
							exit={animation_picker_initial(false)}
							animate={animation_picker_animate}
							key={'permission_page'}
						>
							<OrganizationPermissionList
								org_id={organization.id}
								onPressItem={(permission) => {
									setpermissionCardUser(permission);
									setShowUpdatePermissionCard(true);
								}}
							/>
						</motion.section>
					)}
				</AnimatePresence>
			</div>

			<Card visible={showMemberCard} requestClose={() => setShowMemberCard(false)}>
				{memberCardUser && (
					<OrganizationMemberCard member={memberCardUser} close={() => setShowMemberCard(false)} />
				)}
			</Card>
			<Card visible={showAddMemberCard} requestClose={() => setShowAddMemberCard(false)}>
				<OrganizationAddMemberDialog close={() => setShowAddMemberCard(false)} />
			</Card>

			<Card visible={showCreatePermissionCard} requestClose={() => setShowCreatePermissionCard(false)}>
				<OrganizationPermissionCreateCard close={() => setShowCreatePermissionCard(false)} />
			</Card>

			<Card visible={showUpdatePermissionCard} requestClose={() => setShowUpdatePermissionCard(false)}>
				{permissionCardUser && (
					<OrganizationPermissionUpdateCard
						permission={permissionCardUser}
						close={() => setShowUpdatePermissionCard(false)}
					/>
				)}
			</Card>

			<button
				className={styles.fab}
				onClick={() => (selectedTab === 0 ? setShowAddMemberCard(true) : setShowCreatePermissionCard(true))}
			>
				<AnimatePresence mode={'wait'}>
					{selectedTab === 0 ? (
						<motion.div
							key={'members_page'}
							initial={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
							exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
							animate={{ scale: 1, opacity: 1, transition: { duration: 0.2 } }}
						>
							<UserRoundPlus />
						</motion.div>
					) : (
						<motion.div
							key={'permission_page'}
							initial={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
							exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
							animate={{ scale: 1, opacity: 1, transition: { duration: 0.2 } }}
						>
							<Plus />
						</motion.div>
					)}
				</AnimatePresence>
			</button>
		</NavigationBarHeader>
	);
}
