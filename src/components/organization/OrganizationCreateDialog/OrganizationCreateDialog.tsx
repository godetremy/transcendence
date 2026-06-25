import styles from './components.module.scss';
import { Check, Plus, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { CSSProperties, useEffect, useState } from 'react';
import { CreateOrganizationSchema } from '@/schema/OrganizationSchema';
import { post } from '@/lib/fetcher';
import { PrivateOrganization } from '@/types/Organization';
import { Loader } from '@/components/globals/Loader/Loader';
import { Toggle } from '@/components/globals/Toggle/Toggle';

export function OrganizationCreateDialog({ close }: { close: () => void }) {
	const [creatingOrganization, setCreatingOrganization] = useState(false);
	const [logo, setLogo] = useState<string | undefined>(undefined);
	const [error, setError] = useState<string | undefined>(undefined);

	const [name, setName] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [isClub, setIsClub] = useState(false);

	const createOrganization = () => {
		setCreatingOrganization(true);
		const body = {
			logo,
			name,
			description: description.trim() === '' ? undefined : description,
			club: isClub,
		};

		const result = CreateOrganizationSchema.safeParse(body);
		if (!result.success) {
			setError(result.error.issues[0].message);
			setCreatingOrganization(false);
			return;
		}

		try {
			post<PrivateOrganization>('/organization', body).then(() => {
				setCreatingOrganization(false);
				close();
			});
		} catch (e: unknown) {
			setError((e as Error).message);
			setCreatingOrganization(false);
		}
	};

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
		disabled: creatingOrganization,
		accept: {
			'image/jpeg': ['.jpeg', '.jpg'],
			'image/png': ['.png'],
		},
	});

	useEffect(() => {
		return () => {
			if (logo) {
				URL.revokeObjectURL(logo);
			}
		};
	}, [logo]);

	return (
		<section className={styles.container}>
			<header>
				<button onClick={close} disabled={creatingOrganization}>
					<X />
				</button>
				<h1>Crée une nouvelle organisation</h1>
				<button className={styles.primary} onClick={createOrganization} disabled={creatingOrganization}>
					{creatingOrganization ? <Loader size={24} /> : <Check />}
				</button>
			</header>
			<main>
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
					<input id={'logo'} {...getInputProps()} disabled={creatingOrganization} />
				</label>
				<input
					type={'text'}
					placeholder={"Nom de l'organisation"}
					value={name}
					onChange={(e) => setName(e.target.value)}
					disabled={creatingOrganization}
				/>
				<textarea
					placeholder={'Une petite description ?'}
					value={description}
					onChange={(e) => setDescription(e.currentTarget.value)}
					disabled={creatingOrganization}
				/>
				<label htmlFor={'club'} className={styles.club_toggle}>
					<Toggle
						id={'club'}
						checked={isClub}
						onChange={(e) => setIsClub(e.target.checked)}
						disabled={creatingOrganization}
					/>
					Est-ce un club ?
				</label>
				{error && <p className={styles.error}>{error}</p>}
			</main>
		</section>
	);
}
