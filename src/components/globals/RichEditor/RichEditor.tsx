'use client';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import {
	Bold,
	ChevronDown,
	Heading,
	Image as ImageIcon,
	Italic,
	Link2,
	Minus,
	Redo2,
	Strikethrough,
	Underline as UnderlineIcon,
	Undo2,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useModal } from '@/components/globals/ModalProvider/ModalProvider';
import styles from './component.module.scss';
import { MenuButton } from '@/components/globals/MenuButton/MenuButton';

export interface RichEditorProps {
	content: string;
	onContentChange: (markdown: string) => void;
	placeholder?: string;
}

const HEADING_MENU_ITEMS = [
	{ label: 'Titre 1', level: 1 as const },
	{ label: 'Titre 2', level: 2 as const },
	{ label: 'Titre 3', level: 3 as const },
	{ label: 'Titre 4', level: 4 as const },
	{ label: 'Titre 5', level: 5 as const },
	{ label: 'Titre 6', level: 6 as const },
	{ label: 'Paragraphe', level: null },
];

export function RichEditor({ content, onContentChange, placeholder }: RichEditorProps) {
	const hasLoadedContent = useRef(false);
	const { openModal } = useModal();

	const editor = useEditor({
		extensions: [StarterKit, Markdown, Underline, Link, Image],
		content: '',
		contentType: 'markdown',
		onUpdate: ({ editor }) => {
			queueMicrotask(() => {
				onContentChange(editor.getMarkdown());
			});
		},
	});

	useEffect(() => {
		if (editor && content && !hasLoadedContent.current) {
			editor.commands.setContent(content, { emitUpdate: false, contentType: 'markdown' });
			hasLoadedContent.current = true;
		}
	}, [editor, content]);

	const currentHeadingLabel = HEADING_MENU_ITEMS.find(
		({ level }) => level !== null && editor?.isActive('heading', { level })
	)?.label;

	const changeHeading = (level: 1 | 2 | 3 | 4 | 5 | 6 | null) => {
		if (level !== null) editor?.chain().toggleHeading({ level: level }).run();
		else editor?.chain().setParagraph().run();
	};

	const addLink = () => {
		openModal({
			title: 'Ajouter un lien',
			buttons: [
				{
					text: 'Annuler',
					negative: true,
				},
				{
					text: 'Ajouter',
					onClick: ({ text }) => {
						const url = text?.trim();
						if (url) {
							if (editor?.state.selection.empty) {
								editor?.chain().insertContent(url).setLink({ href: url }).run();
							} else {
								editor?.chain().setLink({ href: url }).run();
							}
						}
					},
				},
			],
			textInput: {
				label: 'URL',
				placeholder: 'https://...',
			},
		});
	};

	const addImage = () => {
		openModal({
			title: 'Ajouter une image',
			buttons: [
				{
					text: 'Annuler',
					negative: true,
				},
				{
					text: 'Ajouter',
					onClick: ({ text }) => {
						const url = text?.trim();
						if (url) editor?.chain().setImage({ src: url }).run();
					},
				},
			],
			textInput: {
				label: "URL de l'image",
				placeholder: 'https://...',
			},
		});
	};

	return (
		<div className={styles.rich_container}>
			<div className={styles.toolbar}>
				<div className={styles.tools_container}>
					<MenuButton
						containerKey={'heading_dropdown'}
						menu={HEADING_MENU_ITEMS.map((label) => ({
							title: label.label,
							onClick: changeHeading.bind(null, label.level),
						}))}
						className={styles.heading_dropdown}
					>
						<Heading size={18} />
						<span>{currentHeadingLabel ?? 'Paragraphe'}</span>
						<ChevronDown size={16} />
					</MenuButton>

					<div className={styles.group}>
						<button
							className={`${styles.toolbar_button} ${editor?.isActive('bold') ? styles.active : ''}`}
							onClick={() => editor?.chain().toggleBold().run()}
						>
							<Bold size={16} />
						</button>
						<button
							className={`${styles.toolbar_button} ${editor?.isActive('italic') ? styles.active : ''}`}
							onClick={() => editor?.chain().toggleItalic().run()}
						>
							<Italic size={16} />
						</button>
						<button
							className={`${styles.toolbar_button} ${editor?.isActive('underline') ? styles.active : ''}`}
							onClick={() => editor?.chain().toggleUnderline().run()}
						>
							<UnderlineIcon size={16} />
						</button>
						<button
							className={`${styles.toolbar_button} ${editor?.isActive('strike') ? styles.active : ''}`}
							onClick={() => editor?.chain().toggleStrike().run()}
						>
							<Strikethrough size={16} />
						</button>
					</div>

					<button className={styles.toolbar_button} onClick={addLink}>
						<Link2 size={16} />
					</button>
					<button className={styles.toolbar_button} onClick={addImage}>
						<ImageIcon size={16} />
					</button>
					<button className={styles.toolbar_button} onClick={() => editor?.chain().setHorizontalRule().run()}>
						<Minus size={16} />
					</button>

					<div className={`${styles.group} ${styles.spacer}`}>
						<button
							className={`${styles.toolbar_button} ${!editor?.can().undo() ? styles.disabled : ''}`}
							onClick={() => editor?.chain().undo().run()}
						>
							<Undo2 size={16} />
						</button>
						<button
							className={`${styles.toolbar_button} ${!editor?.can().redo() ? styles.disabled : ''}`}
							onClick={() => editor?.chain().redo().run()}
						>
							<Redo2 size={16} />
						</button>
					</div>
				</div>
			</div>

			<EditorContent editor={editor} className={styles.editor} placeholder={placeholder} />
		</div>
	);
}
