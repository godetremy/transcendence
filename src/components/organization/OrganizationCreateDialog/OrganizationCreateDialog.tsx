import { OrganizationEditor } from '@/components/organization/OrganizationEditor/OrganizationEditor';
import { useEffect, useState } from 'react';
import { CreateOrganizationType } from '@/types/Organization';
import styles from './components.module.scss';
import { CardHeader } from '@/components/globals/CardHeader/CardHeader';
import { useMutation } from '@tanstack/react-query';
import { createOrganization } from '@/lib/fetcher/organization';
import { CreateOrganizationSchema } from '@/schema/OrganizationSchema';

interface OrganizationCreateDialogProps {
	close: () => void;
}

export default function OrganizationCreateDialog({ close }: OrganizationCreateDialogProps) {
	const mutation = useMutation(createOrganization());

	const [error, setError] = useState<string | undefined>(undefined);
	const [isValid, setIsValid] = useState(true);
	const [organization, setOrganization] = useState<CreateOrganizationType>({
		name: '',
		club: false,
	});

	const create = () => {
		setError(undefined);
		mutation.mutate({ org: organization });
		setError(mutation.error?.message);
		if (mutation.error === null) close();
	};

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsValid(CreateOrganizationSchema.safeParse(organization).success);
	}, [organization]);

	return (
		<div className={styles.container}>
			<CardHeader
				title={'Crée une nouvelle organisation'}
				onClose={close}
				onAccept={create}
				disabledAccept={!isValid}
				loading={mutation.isPending}
			/>
			<OrganizationEditor
				organization={organization}
				setOrganization={setOrganization}
				disabled={mutation.isPending}
				error={error}
				setError={setError}
			/>
		</div>
	);
}
