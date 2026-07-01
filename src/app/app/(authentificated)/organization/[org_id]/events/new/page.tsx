'use client';
import styles from './page.module.scss';
import {
	MDXEditor,
	headingsPlugin,
	listsPlugin,
	quotePlugin,
	thematicBreakPlugin,
	toolbarPlugin,
	UndoRedo,
	BoldItalicUnderlineToggles,
	markdownShortcutPlugin,
	linkPlugin,
	InsertImage,
	InsertTable,
	InsertThematicBreak,
	BlockTypeSelect,
	linkDialogPlugin,
	tablePlugin,
	imagePlugin,
	CreateLink,
	Separator,
} from '@mdxeditor/editor';
import { Toggle } from '@/components/globals/Toggle/Toggle';
import { CalendarFold, ChevronLeft, MapPin, Minus, Plus, Users2 } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { InputDatePicker } from '@/components/globals/DatePicker/DatePicker';
import { AnimatePresence, motion } from 'motion/react';
import fr from '@/locales/mdxeditor-fr.json';

export default function Page() {
	const [showRegisterLimit, setShowRegisterLimit] = useState(false);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [registrationLimit, setRegistrationLimit] = useState(40);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: () => {},
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
					<button>
						<ChevronLeft />
					</button>
					<span>Nouvelle événement</span>
					<button>
						<Plus />
						Ajouter
					</button>
				</nav>
				<div className={styles.main_content}>
					<label {...getRootProps()} className={styles.cover}>
						<input {...getInputProps()} />
					</label>
					<label className={styles.title}>
						<input type="text" placeholder={"Nom de l'événement"} />
						<button>Modifer le rendu de l&#39;image</button>
					</label>
					<div className={styles.date_picker}>
						<CalendarFold size={22} />
						Du
						<InputDatePicker
							selected={startDate}
							onChange={(date) => {
								if (date) setStartDate(date);
							}}
						/>
						au
						<InputDatePicker
							selected={endDate}
							onChange={(date) => {
								if (date) setEndDate(date);
							}}
						/>
					</div>
					<label className={styles.location} htmlFor={'location'}>
						<MapPin />
						<input type={'text'} id={'location'} placeholder={'Aucun emplacement'} />
					</label>
					<div className={styles.registration}>
						<Users2 size={22} />
						<div>
							<label htmlFor={'limit_registration'} className={styles.limit_registration}>
								<Toggle
									id={'limit_registration'}
									checked={showRegisterLimit}
									onChange={(e) => setShowRegisterLimit(e.target.checked)}
								/>
								<span>Limiter les inscriptions</span>
							</label>
							<AnimatePresence initial={false}>
								{showRegisterLimit && (
									<motion.label
										htmlFor={'max_registration'}
										className={styles.max_registration}
										initial={{ opacity: 0, marginTop: -22, marginBottom: -30 }}
										animate={{ opacity: 1, marginTop: 0, marginBottom: 0 }}
										exit={{ opacity: 0, marginTop: -22, marginBottom: -30 }}
									>
										<button
											onClick={() => setRegistrationLimit(Math.max(0, registrationLimit - 1))}
										>
											<Minus size={22} />
										</button>
										<input
											type={'number'}
											id={'max_registration'}
											placeholder={'40'}
											value={registrationLimit}
											onChange={(e) => setRegistrationLimit(parseInt(e.target.value))}
										/>
										<button
											onClick={() => setRegistrationLimit(Math.max(0, registrationLimit + 1))}
										>
											<Plus size={22} />
										</button>
									</motion.label>
								)}
							</AnimatePresence>
						</div>
					</div>

					<MDXEditor
						markdown="# Hello world\n![demo](https://picsum.photos/200/300)"
						className={styles.mdeditor}
						contentEditableClassName={'event_markdown'}
						plugins={[
							headingsPlugin(),
							quotePlugin(),
							listsPlugin(),
							thematicBreakPlugin(),
							linkPlugin(),
							linkDialogPlugin(),
							markdownShortcutPlugin(),
							tablePlugin(),
							imagePlugin({
								imageUploadHandler: () => {
									return Promise.resolve('https://picsum.photos/200/300');
								},
								imageAutocompleteSuggestions: [
									'https://picsum.photos/200/300',
									'https://picsum.photos/200',
								],
							}),
							toolbarPlugin({
								toolbarClassName: 'my-classname',
								toolbarContents: () => (
									<>
										<BlockTypeSelect />
										<BoldItalicUnderlineToggles />
										<Separator />
										<CreateLink />
										<InsertImage />
										<InsertTable />
										<InsertThematicBreak />
										<UndoRedo />
									</>
								),
							}),
						]}
						placeholder={'Entre ta description ici. (psst... On supporte le markdown)'}
						translation={(key, defaultValue, interpolations) => {
							const text = key.split('.').reduce<unknown>((obj, part) => {
								if (obj && typeof obj === 'object') {
									return (obj as Record<string, unknown>)[part];
								}
								return undefined;
							}, fr);
							let result = typeof text === 'string' ? text : defaultValue;
							if (interpolations) {
								for (const [k, v] of Object.entries(interpolations)) {
									result = result.replace(`{{${k}}}`, String(v));
								}
							}
							return result;
						}}
					/>
				</div>
			</section>
			<section className={styles.preview_section}>
				<h3>Preview coming soon...</h3>
			</section>
		</article>
	);
}
