import styles from './component.module.scss';
import { CSSProperties, Dispatch, SetStateAction, useState } from 'react';
import { Plus } from 'lucide-react';
import { Toggle } from '@/components/globals/Toggle/Toggle';
import { CreateOrganizationType } from '@/types/Organization';
import { useDropzone } from 'react-dropzone';
import { CircleLoader } from '@/components/globals/CircleLoader/CircleLoader';
import { useUpload } from '@/contexts/UploadTokenContext';

export interface OrganizationEditorProps {
	organization: CreateOrganizationType;
	setOrganization: Dispatch<SetStateAction<CreateOrganizationType>>;
	disabled?: boolean;
	error?: string;
	setError?: Dispatch<SetStateAction<string | undefined>>;
}

export function OrganizationEditor(props: OrganizationEditorProps) {
	const upload = useUpload();

	const [logo, setLogo] = useState<string | undefined>(props.organization.logo);
	const [uploadImage, setUploadImage] = useState(false);
	const [uploadProgression, setUploadProgression] = useState(0);

	const onDrop = async (acceptedFiles: File[]) => {
		if (acceptedFiles.length <= 0) {
			if (props.setError) props.setError("Ce fichier n'est pas supporté.");
			return;
		}
		if (props.setError) props.setError(undefined);
		setLogo(URL.createObjectURL(acceptedFiles[0]));
		setUploadProgression(0);
		setUploadImage(true);
		upload.uploadFiles(acceptedFiles, setUploadProgression).then((file) => {
			props.setOrganization((prev) => ({
				...prev,
				logo: `/images/upload/${file.name}`,
			}));
			setUploadImage(false);
		});
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
				{uploadImage && (
					<div>
						<CircleLoader progress={uploadProgression} size={64} />
					</div>
				)}
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
			{props.error && <p className={styles.error}>{props.error}</p>}
		</main>
	);
}
