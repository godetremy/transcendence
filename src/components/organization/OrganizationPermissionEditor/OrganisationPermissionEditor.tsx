import styles from './component.module.scss';
import ListContainer from '@/components/globals/ListContainer/ListContainer';
import ListItem from '@/components/globals/ListItem/ListItem';
import { Toggle } from '@/components/globals/Toggle/Toggle';
import { Dispatch, Fragment, SetStateAction } from 'react';
import { OrganizationPermissionDetails } from '@/types/OrganizationPermissionDetails';

const PERMISSION_LIST: Array<{
	title: string;
	content: { title: string; description?: string; key: keyof OrganizationPermissionDetails }[];
}> = [
	{
		title: 'Événements',
		content: [
			{
				title: 'Crée des événements',
				key: 'event_create',
			},
			{
				title: 'Modifier des événements',
				key: 'event_update',
			},
			{
				title: 'Supprimer des événements',
				key: 'event_delete',
			},
		],
	},
	{
		title: 'Services',
		content: [
			{
				title: 'Crée des services',
				key: 'service_create',
			},
			{
				title: 'Modifier des services',
				key: 'service_update',
			},
			{
				title: 'Supprimer des services',
				key: 'service_delete',
			},
		],
	},
	{
		title: 'Membres et permissions',
		content: [
			{
				title: 'Inviter des membres',
				key: 'members_invite',
			},
			{
				title: 'Gérer les membres',
				description: "Exclure et modifier les rôles d'un membre",
				key: 'members_manage',
			},
			{
				title: 'Gérer les permissions',
				description: 'Créer, modifier ou supprimer des permissions',
				key: 'organization_manage_permission',
			},
		],
	},
	{
		title: 'Organisation',
		content: [
			{
				title: "Modifier les information de l'organisation",
				key: 'organization_update_info',
			},
			{
				title: "Gérer l'organisation",
				description: "Supprimer l'organisation",
				key: 'organization_manage',
			},
		],
	},
];

export function OrganisationPermissionEditor({
	permission,
	setPermission,
	disabled = false,
}: {
	permission: OrganizationPermissionDetails;
	setPermission: Dispatch<SetStateAction<OrganizationPermissionDetails>>;
	disabled?: boolean;
}) {
	return (
		<div className={styles.container}>
			<div className={styles.details}>
				<input
					className={styles.title}
					type={'text'}
					placeholder={'Nom de ta permission'}
					value={permission.name}
					onChange={(e) => setPermission((prev) => ({ ...prev, name: e.target.value }))}
					disabled={disabled}
				/>
				<input
					className={styles.description}
					type={'text'}
					placeholder={'Une petite description ?'}
					value={permission.description ?? ''}
					onChange={(e) =>
						setPermission((prev) => ({
							...prev,
							description: e.target.value.trim().length === 0 ? null : e.target.value,
						}))
					}
					disabled={disabled}
				/>
			</div>
			{PERMISSION_LIST.map((section, i) => (
				<Fragment key={i}>
					<span>{section.title}</span>
					<ListContainer>
						{section.content.map((item, i) => (
							<ListItem
								key={item.key}
								title={item.title}
								description={item.description}
								showChevron={false}
								last={i === section.content.length - 1}
								disabled={disabled}
								rightElement={
									<label htmlFor={item.key} className={styles.label}>
										<Toggle
											id={item.key}
											checked={permission[item.key] as boolean}
											onChange={(e) => {
												setPermission((prev) => ({
													...prev,
													[item.key]: e.target.checked,
												}));
											}}
										/>
									</label>
								}
							/>
						))}
					</ListContainer>
				</Fragment>
			))}
		</div>
	);
}
