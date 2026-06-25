import { OrganizationEditor } from '@/components/organization/OrganizationEditor/OrganizationEditor';
import { useState } from 'react';
import { CreateOrganizationType } from '@/types/Organization';
import styles from './components.module.scss';
import { CardHeader } from '@/components/globals/CardHeader/CardHeader';

interface OrganizationCreateDialogProps {
	close: () => void;
}

export default function OrganizationCreateDialog({ close }: OrganizationCreateDialogProps) {
	const [organization, setOrganization] = useState<CreateOrganizationType>({
		name: '',
		description: '',
		logo: '',
		club: false,
	});

	return (
		<div className={styles.container}>
			<CardHeader title={'Crée une nouvelle organisation'} onClose={close} onAccept={() => {}}></CardHeader>
			<OrganizationEditor organization={organization} setOrganization={setOrganization} />
		</div>
	);
}
