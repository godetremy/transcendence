import styles from './component.module.scss';
import { CSSProperties, Dispatch, SetStateAction, useState } from 'react';
import { Plus } from 'lucide-react';
import { Toggle } from '@/components/globals/Toggle/Toggle';
import { CreateOrganizationType } from '@/types/Organization';
import { useDropzone } from 'react-dropzone';

export interface OrganizationEditorProps {
	organization: CreateOrganizationType;
	setOrganization: Dispatch<SetStateAction<CreateOrganizationType>>;
	disabled?: boolean;
}

export function OrganizationEditor(props: OrganizationEditorProps) {
	const [logo, setLogo] = useState<string | undefined>(undefined);
	const [error, setError] = useState<string | undefined>(undefined);

	const onDrop = async (acceptedFiles: File[]) => {
		if (acceptedFiles.length <= 0) {
			setError("Ce fichier n'est pas supporté.");
			return;
		}
		setLogo(URL.createObjectURL(acceptedFiles[0]));
		setError(undefined);
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		maxFiles: 1,
		noClick: true,
		disabled: props.disabled,
		accept: {
			'image/jpeg': ['.jpeg', '.jpg'],
			'image/png': ['.png'],
		},
	});

	return (
		<main className={styles.editor_container}>
			<label
				htmlFor={'logo'}
				className={`${styles.file_input} ${isDragActive ? styles.active : ''}`}
				style={
					{
						'--preview-image': `url(${logo ?? ''})`,
					} as CSSProperties
				}
				{...getRootProps()}
			>
				{!logo && <Plus size={100} strokeWidth={2.5} />}
				<input id={'logo'} {...getInputProps()} disabled={props.disabled} />
			</label>
			<input
				type={'text'}
				placeholder={"Nom de l'organisation"}
				value={props.organization.name}
				onChange={(e) => props.setOrganization((prev) => ({ ...prev, name: e.target.value }))}
				disabled={props.disabled}
			/>
			<textarea
				placeholder={'Une petite description ?'}
				value={props.organization.description ?? ''}
				onChange={(e) => props.setOrganization((prev) => ({ ...prev, description: e.target.value }))}
				disabled={props.disabled}
			/>
			<label htmlFor={'club'} className={styles.club_toggle}>
				<Toggle
					id={'club'}
					checked={props.organization.club}
					onChange={(e) => props.setOrganization((prev) => ({ ...prev, club: e.target.checked }))}
					disabled={props.disabled}
				/>
				Est-ce un club ?
			</label>
			{error && <p className={styles.error}>{error}</p>}
		</main>
	);
}
