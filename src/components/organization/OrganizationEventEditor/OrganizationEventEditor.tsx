import { InputDatePicker } from '@/components/globals/DatePicker/DatePicker';
import { ImageEditorCard } from '@/components/globals/ImageEditor/ImageEditorCard';
import { Toggle } from '@/components/globals/Toggle/Toggle';
import { CreateOrUpdateEventType, PrivateEvent } from '@/types/Event';
import { RichEditor } from '@/components/globals/RichEditor/RichEditor';
import { CalendarFold, ChevronLeft, MapPin, Minus, Plus, Save, Users2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './page.module.scss';
import { ImageEditor } from '@/utils/image';
import { useUpload } from '@/contexts/UploadTokenContext';
import { CircleLoader } from '@/components/globals/CircleLoader/CircleLoader';
import { ToastType, useToast } from '@/components/globals/ToastProvider/ToastProvider';

export interface OrganizationEventEditor {
	event: CreateOrUpdateEventType;
	setEvent: Dispatch<SetStateAction<CreateOrUpdateEventType>>;
	onSubmit: () => Promise<PrivateEvent<object>>;
	onNew?: () => void;
	createEvent: boolean;
}

const fieldLabels: Record<string, string> = {
	title: 'Nom',
	subtitle: 'Sous-titre',
	description: 'Description',
	location: 'Lieu',
	max_registration: "Nombre d'inscriptions",
	image: 'Image',
	start_at: 'Date de début',
	end_at: 'Date de fin',
};

export function OrganizationEventEditor(props: OrganizationEventEditor) {
	const [showImageEdit, setShowImageEdit] = useState(false);
	const upload = useUpload();
	const [uploadImage, setUploadImage] = useState(false);
	const [uploadProgression, setUploadProgression] = useState(0);

	const [image, setImage] = useState<File | null>(null);
	const [previewBlob, setPreviewBlob] = useState<string | null>(null);
	const toast = useToast();

	const editor = useRef<ImageEditor | null>(null);

	useEffect(() => {
		editor.current = new ImageEditor();
		return () => editor.current?.destroy();
	}, []);

	useEffect(() => {
		if (!previewBlob) return;
		editor.current?.renderPreview().then((blob) => setPreviewBlob(URL.createObjectURL(blob)));
	}, [showImageEdit]);

	useEffect(() => {
		if (!image) return;

		editor.current
			?.loadTexture(image)
			.then(() => {
				editor.current?.edit({ brightness: 0, contrast: 0, sharpness: 0 });
				editor.current?.renderPreview().then((blob) => setPreviewBlob(URL.createObjectURL(blob)));
			})
			.catch((e) => console.error(e));
	}, [image]);

	const publishEvent = async () => {
		try {
			setUploadProgression(0);
			setUploadImage(true);
			const renderImage = await editor.current?.render();
			if (!renderImage) {
				toast.showToast({
					title: 'Erreur',
					message: "Impossible de rendre l'image.",
					type: ToastType.ERROR,
				});
				return;
			}
			const file = await upload.uploadFiles(renderImage, setUploadProgression);
			props.setEvent((prev) => ({ ...prev, image: `/images/upload/${file.name}` }));
			setUploadImage(false);
			await props.onSubmit();
			toast.showToast({
				title: 'Succès',
				message: props.createEvent ? 'Événement créé avec succès.' : 'Événement mis à jour avec succès.',
				type: ToastType.SUCCESS,
			});
			props.onNew?.();
		} catch (err: unknown) {
			const message = (err as Error).message;
			const match = message.match(/'([^']+)'/);
			const fieldKey = match?.[1];
			const displayMessage =
				fieldKey && fieldLabels[fieldKey]
					? message.replace(`'${fieldKey}'`, `'${fieldLabels[fieldKey]}'`)
					: message;

			toast.showToast({
				title: 'Erreur',
				message: displayMessage,
				type: ToastType.ERROR,
			});
		}
	};

	const {
		getRootProps,
		getInputProps,
		open: openImagePicker,
	} = useDropzone({
		onDrop: (acceptedFiles) => {
			setImage(acceptedFiles[0]);
		},
		maxFiles: 1,
		noClick: true,
		accept: {
			'image/jpeg': ['.jpeg', '.jpg'],
			'image/png': ['.png'],
		},
	});

	return (
		<article className={styles.main_container}>
			<section className={styles.edit_section}>
				<nav>
					<div>
						<button className={styles.icon} onClick={() => props.onNew?.()}>
							<ChevronLeft style={{ marginRight: 1.5 }} />
						</button>
						<span>{props.createEvent ? 'Nouvelle ' : "Edition de l'"}événement</span>
						<button className={styles.primary} onClick={publishEvent}>
							{props.createEvent ? <Plus /> : <Save />}
							{props.createEvent ? `Ajouter` : `Enregistrer les modifications`}
						</button>
					</div>
				</nav>
				<div className={styles.main_content}>
					<label
						{...getRootProps()}
						className={styles.cover}
						style={{ backgroundImage: `url(${previewBlob})` }}
					>
						{uploadImage && (
							<div>
								<CircleLoader progress={uploadProgression} size={32} />
								Upload en cours...
							</div>
						)}
						<input {...getInputProps()} />
					</label>
					<label className={styles.title}>
						<div className={styles.container}>
							<div className={styles.titles_container}>
								<input
									type="text"
									placeholder={"Nom de l'événement"}
									className={styles.title_input}
									value={props.event.title}
									onChange={(e) => props.setEvent((prev) => ({ ...prev, title: e.target.value }))}
									autoFocus
								/>
								<input
									type="text"
									placeholder={"Sous-titre de l'événement"}
									className={styles.subtitle_input}
									value={props.event.subtitle ?? ''}
									onChange={(e) => props.setEvent((prev) => ({ ...prev, subtitle: e.target.value }))}
								/>
							</div>
							<button
								onClick={() => {
									if (!previewBlob) {
										openImagePicker();
										return;
									}
									setShowImageEdit(true);
								}}
							>
								{previewBlob ? "Modifer le rendu de l'image" : 'Importer une image'}
							</button>
						</div>
					</label>
					<div className={styles.date_picker}>
						<CalendarFold size={22} />
						Du
						<InputDatePicker
							selected={props.event.start_at}
							onChange={(date) => props.setEvent((prev) => ({ ...prev, start_at: date ?? new Date() }))}
						/>
						au
						<InputDatePicker
							selected={props.event.end_at}
							onChange={(date) => props.setEvent((prev) => ({ ...prev, end_at: date ?? new Date() }))}
						/>
					</div>
					<label className={styles.location} htmlFor={'location'}>
						<MapPin />
						<input
							type={'text'}
							id={'location'}
							placeholder={'Aucun emplacement'}
							value={props.event.location ?? ''}
							onChange={(e) => props.setEvent((prev) => ({ ...prev, location: e.target.value }))}
						/>
					</label>
					<div className={styles.registration}>
						<Users2 size={22} />
						<div>
							<label htmlFor={'limit_registration'} className={styles.limit_registration}>
								<Toggle
									id={'limit_registration'}
									checked={props.event.max_registration !== null}
									onChange={(e) => {
										const checked = e.currentTarget.checked;

										props.setEvent((prev) => ({
											...prev,
											max_registration: checked ? 40 : null,
										}));
									}}
								/>
								<span>Limiter les inscriptions</span>
							</label>
							<AnimatePresence initial={false}>
								{props.event.max_registration !== null && (
									<motion.label
										htmlFor={'max_registration'}
										className={styles.max_registration}
										initial={{ opacity: 0, marginTop: -22, marginBottom: -30 }}
										animate={{ opacity: 1, marginTop: 0, marginBottom: 0 }}
										exit={{ opacity: 0, marginTop: -22, marginBottom: -30 }}
									>
										<button
											onClick={() =>
												props.setEvent((prev) => ({
													...prev,
													max_registration: (prev.max_registration ?? 40) - 1,
												}))
											}
										>
											<Minus size={22} />
										</button>
										<input
											type={'number'}
											id={'max_registration'}
											placeholder={'40'}
											value={props.event.max_registration ?? 40}
											onChange={(e) =>
												props.setEvent((prev) => ({
													...prev,
													max_registration: parseInt(e.target.value),
												}))
											}
										/>
										<button
											onClick={() =>
												props.setEvent((prev) => ({
													...prev,
													max_registration: (prev.max_registration ?? 40) + 1,
												}))
											}
										>
											<Plus size={22} />
										</button>
									</motion.label>
								)}
							</AnimatePresence>
						</div>
					</div>
					<div className={styles.editor_toolbar}>
						<RichEditor
							content={props.event.description ?? ''}
							onContentChange={(markdown) =>
								props.setEvent((prev) => ({ ...prev, description: markdown }))
							}
							placeholder="Entre ta description ici. (psst... On supporte le markdown)"
						/>
					</div>
				</div>
			</section>
			{image && <ImageEditorCard editor={editor} visible={showImageEdit} setVisible={setShowImageEdit} />}
		</article>
	);
}
