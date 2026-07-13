'use client';
import styles from './page.module.scss';
import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import { CalendarFold, ChevronLeft, MapPin, Minus, Plus, ScanEye, Users2 } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { InputDatePicker } from '@/components/globals/DatePicker/DatePicker';
import { useMutation } from '@tanstack/react-query';
import { useOrganizations } from '@/contexts/OrganizationsContext';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { useRouter } from 'next/navigation';
import { ImageEditorCard } from '@/components/globals/ImageEditor/ImageEditorCard';
import { createServiceMutate } from '@/lib/fetcher/services';
import { CreateOrUpdateServiceType } from '@/types/Service';

export default function Page() {
	const router = useRouter();
	const orgctx = useOrganizations();
	const organization = orgctx.getCurrentOrganization()!;

	const { mutate } = useMutation(createServiceMutate(organization.id));

	const [showImageEdit, setShowImageEdit] = useState(false);

	const [service, setService] = useState<CreateOrUpdateServiceType>({
		category_id: '',
		title: '',
		subtitle: '',
		description: '',
		location: '',
		image: '',
		edition: 0,
		registration_required: false,
		registration_details: '',
		registration_link: '',
		source_link: '',
		start_at: new Date(),
		end_at: new Date(),
		registration_full: false,
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
			ctx.editor.on('update', () => setService((prev) => ({ ...prev, description: ctx.editor.getMarkdown() })));
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
					<span>Nouveau Service</span>
					<button>
						<ScanEye />
						Prévisualiser
					</button>
					<button
						className={styles.primary}
						onClick={(e) => {
							mutate({ service });
							if (!e.getModifierState('Shift')) router.push('../services');
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
								value={service.title}
								onChange={(e) => setService((prev) => ({ ...prev, title: e.target.value }))}
								autoFocus
							/>
							<input
								type="text"
								placeholder={"Sous-titre de l'événement"}
								className={styles.subtitle_input}
								value={service.subtitle ?? ''}
								onChange={(e) => setService((prev) => ({ ...prev, subtitle: e.target.value }))}
							/>
						</div>
						<button onClick={() => setShowImageEdit(true)}>Modifer le rendu de l&#39;image</button>
					</label>
					<div className={styles.date_picker}>
						<CalendarFold size={22} />
						Du
						<InputDatePicker
							selected={service.start_at ?? new Date()}
							onChange={(date) => setService((prev) => ({ ...prev, start_at: date ?? new Date() }))}
						/>
						au
						<InputDatePicker
							selected={service.end_at ?? new Date()}
							onChange={(date) => setService((prev) => ({ ...prev, end_at: date ?? new Date() }))}
						/>
					</div>
					<label className={styles.location} htmlFor={'location'}>
						<MapPin />
						<input
							type={'text'}
							id={'location'}
							placeholder={'Aucun emplacement'}
							value={service.location ?? ''}
							onChange={(e) => setService((prev) => ({ ...prev, location: e.target.value }))}
						/>
					</label>
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
