import { InputDatePicker } from '@/components/globals/DatePicker/DatePicker';
import { ImageEditorCard } from '@/components/globals/ImageEditor/ImageEditorCard';
import { Toggle } from '@/components/globals/Toggle/Toggle';
import { CreateOrUpdateEventType } from '@/types/Event';
import { Markdown } from '@tiptap/markdown';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { CalendarFold, ChevronLeft, MapPin, Minus, Plus, ScanEye, Users2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './page.module.scss';

export interface OrganizationEventEditor {
	event: CreateOrUpdateEventType;
	setEvent: Dispatch<SetStateAction<CreateOrUpdateEventType>>;
	onSubmit: () => void;
	onNew?: () => void;
	createEvent: Boolean;
}

export function OrganizationEventEditor(props: OrganizationEventEditor) {
	const [showImageEdit, setShowImageEdit] = useState(false);

	const [image, setImage] = useState<File | null>(null);
	const [previewBlob, setPreviewBlob] = useState<string | null>(null);
	const hasLoadedContent = useRef(false);

	const editor = useEditor({
		extensions: [StarterKit, Markdown],
		content: '',
		contentType: 'markdown',
		onUpdate: ({ editor }) => {
			queueMicrotask(() => {
				props.setEvent((prev) => ({ ...prev, description: editor.getMarkdown() }));
			});
		},
	});

	useEffect(() => {
		if (editor && props.event.description && !hasLoadedContent.current) {
			editor.commands.setContent(props.event.description, { emitUpdate: false });
			hasLoadedContent.current = true;
		}
	}, [editor, props.event.description]);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles) => {
			setPreviewBlob(URL.createObjectURL(acceptedFiles[0]));
			setImage(acceptedFiles[0]);
		},
		maxFiles: 1,
		noClick: true,
		//disabled: props.disabled,
		accept: {
			'image/jpeg': ['.jpeg', '.jpg'],
			'image/png': ['.png'],
		},
	});

	return (
		<article className={styles.main_container}>
			<section className={styles.edit_section}>
				<nav>
					<button className={styles.icon} onClick={() => props.onNew?.()}>
						<ChevronLeft style={{ marginRight: 1.5 }} />
					</button>
					<span>{props.createEvent ? `Nouvelle` : `Edition d'`} événement</span>
					<button>
						<ScanEye />
						Prévisualiser
					</button>
					<button
						className={styles.primary}
						onClick={(e) => {
							props.onSubmit();
							props.onNew?.();
							console.log(props.onNew);
						}}
					>
						<Plus />
						{props.createEvent ? `Ajouter` : `Editer`}
					</button>
				</nav>
				<div className={styles.main_content}>
					<label
						{...getRootProps()}
						className={styles.cover}
						style={{ backgroundImage: `url(${previewBlob})` }}
					>
						<input {...getInputProps()} />
					</label>
					<label className={styles.title}>
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
						<button onClick={() => setShowImageEdit(true)}>Modifer le rendu de l&#39;image</button>
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
					<div className={styles.editor_toolbar}></div>
					<EditorContent
						editor={editor}
						className={styles.editor_container}
						placeholder={'Entre ta description ici. (psst... On supporte le markdown)'}
					/>
				</div>
			</section>
			<section className={styles.preview_section}>
				<h3>Preview coming soon...</h3>
			</section>
			{image && <ImageEditorCard file={image} visible={showImageEdit} setVisible={setShowImageEdit} />}
		</article>
	);
}
