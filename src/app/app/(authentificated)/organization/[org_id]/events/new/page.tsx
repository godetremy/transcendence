'use client';
import styles from './page.module.scss';
import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import { Toggle } from '@/components/globals/Toggle/Toggle';
import { CalendarFold, ChevronLeft, MapPin, Minus, Plus, ScanEye, Users2 } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { InputDatePicker } from '@/components/globals/DatePicker/DatePicker';
import { AnimatePresence, motion } from 'motion/react';
import { useMutation } from '@tanstack/react-query';
import { createEvent } from '@/lib/fetcher/events';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { ImageEditor } from '@/components/globals/ImageEditor/ImageEditor';
import { CreateOrUpdateEventType } from '@/types/Event';
import { useRouter } from 'next/navigation';

export default function Page() {
	const router = useRouter();
	const orgctx = useOrganizations();
	const organization = orgctx.getCurrentOrganization()!;

	const { mutate } = useMutation(createEvent(organization.id));

	const [showImageEdit, setShowImageEdit] = useState(false);

	const [event, setEvent] = useState<CreateOrUpdateEventType>({
		title: '',
		subtitle: '',
		description: '',
		max_registration: null,
		location: '',
		image: '',
		start_at: new Date(),
		end_at: new Date(),
	});

	const [image, setImage] = useState<File | null>(null);
	const [previewBlob, setPreviewBlob] = useState<string | null>(null);

	const editor = useEditor({
		extensions: [StarterKit, Markdown],
		content: '',
		contentType: 'markdown',
	});

	useEditorState({
		editor,
		selector: (ctx) => {
			if (!ctx.editor) return;
			ctx.editor.on('update', () => setEvent((prev) => ({ ...prev, description: ctx.editor.getMarkdown() })));
		},
	});

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
					<button className={styles.icon} onClick={() => router.back()}>
						<ChevronLeft style={{ marginRight: 1.5 }} />
					</button>
					<span>Nouvelle événement</span>
					<button>
						<ScanEye />
						Prévisualiser
					</button>
					<button
						className={styles.primary}
						onClick={(e) => {
							mutate({ event });
							if (!e.getModifierState('Shift')) router.push('../events');
						}}
					>
						<Plus />
						Ajouter
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
								value={event.title}
								onChange={(e) => setEvent((prev) => ({ ...prev, title: e.target.value }))}
								autoFocus
							/>
							<input
								type="text"
								placeholder={"Sous-titre de l'événement"}
								className={styles.subtitle_input}
								value={event.subtitle ?? ''}
								onChange={(e) => setEvent((prev) => ({ ...prev, subtitle: e.target.value }))}
							/>
						</div>
						<button onClick={() => setShowImageEdit(true)}>Modifer le rendu de l&#39;image</button>
					</label>
					<div className={styles.date_picker}>
						<CalendarFold size={22} />
						Du
						<InputDatePicker
							selected={event.start_at}
							onChange={(date) => setEvent((prev) => ({ ...prev, start_at: date ?? new Date() }))}
						/>
						au
						<InputDatePicker
							selected={event.end_at}
							onChange={(date) => setEvent((prev) => ({ ...prev, end_at: date ?? new Date() }))}
						/>
					</div>
					<label className={styles.location} htmlFor={'location'}>
						<MapPin />
						<input
							type={'text'}
							id={'location'}
							placeholder={'Aucun emplacement'}
							value={event.location ?? ''}
							onChange={(e) => setEvent((prev) => ({ ...prev, location: e.target.value }))}
						/>
					</label>
					<div className={styles.registration}>
						<Users2 size={22} />
						<div>
							<label htmlFor={'limit_registration'} className={styles.limit_registration}>
								<Toggle
									id={'limit_registration'}
									checked={event.max_registration !== null}
									onChange={(e) => {
										const checked = e.currentTarget.checked;

										setEvent((prev) => ({
											...prev,
											max_registration: checked ? 40 : null,
										}));
									}}
								/>
								<span>Limiter les inscriptions</span>
							</label>
							<AnimatePresence initial={false}>
								{event.max_registration !== null && (
									<motion.label
										htmlFor={'max_registration'}
										className={styles.max_registration}
										initial={{ opacity: 0, marginTop: -22, marginBottom: -30 }}
										animate={{ opacity: 1, marginTop: 0, marginBottom: 0 }}
										exit={{ opacity: 0, marginTop: -22, marginBottom: -30 }}
									>
										<button
											onClick={() =>
												setEvent((prev) => ({
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
											value={event.max_registration ?? 40}
											onChange={(e) =>
												setEvent((prev) => ({
													...prev,
													max_registration: parseInt(e.target.value),
												}))
											}
										/>
										<button
											onClick={() =>
												setEvent((prev) => ({
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
			{image && <ImageEditor file={image} visible={showImageEdit} setVisible={setShowImageEdit} />}
		</article>
	);
}
