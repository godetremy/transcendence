'use client';
import styles from './component.module.scss';
import { useState, useRef, useEffect, RefObject } from 'react';
import { Card } from '@/components/globals/Card/Card';
import { CardHeader } from '@/components/globals/CardHeader/CardHeader';
import { ImageEditionParameters, ImageEditor } from '@/utils/image';

export interface ImageEditorProps {
	editor: RefObject<ImageEditor | null>;
	visible: boolean;
	setVisible: (visible: boolean) => void;
}

export function ImageEditorCard({ editor, visible, setVisible }: ImageEditorProps) {
	const [params, setParams] = useState<ImageEditionParameters>(
		editor.current?.params ?? { brightness: 0, contrast: 0, sharpness: 0 }
	);

	const [render, setRender] = useState<string | null>(null);

	const containerRef = useRef<HTMLDivElement>(null);

	/**
	 * Load the image in the canva
	 */
	useEffect(() => {
		if (!editor.current || !containerRef.current) return;

		editor.current.renderPreview().then((blob) => {
			setRender((prev) => {
				if (prev) URL.revokeObjectURL(prev);
				return URL.createObjectURL(blob);
			});
		});

		return () => {
			if (render) URL.revokeObjectURL(render);
		};
	}, [editor, render, visible]);

	useEffect(() => {
		if (!editor.current) return;
		editor.current.edit(params);
		editor.current.renderPreview().then((blob) => {
			setRender((prev) => {
				if (prev) URL.revokeObjectURL(prev);
				return URL.createObjectURL(blob);
			});
		});
	}, [params, editor]);

	if (!editor.current) return null;

	return (
		<Card visible={visible} requestClose={() => setVisible(false)}>
			<section className={styles.main_container}>
				<CardHeader title={"Modifier l'image"} onClose={() => setVisible(false)} />

				<div ref={containerRef} className={styles.preview_container}>
					{render && <img src={render} alt={'Image de rendu'} />}
				</div>

				<div className={styles.options_container}>
					<label>
						Exposition
						<input
							type="range"
							min="-75"
							max="75"
							value={params.brightness * 100}
							onChange={(e) =>
								setParams((prev) => ({
									...prev,
									brightness: Number(e.target.value) / 100,
								}))
							}
							onDoubleClick={() =>
								setParams((prev) => ({
									...prev,
									brightness: 0,
								}))
							}
						/>
					</label>
					<label>
						Contraste
						<input
							type="range"
							min="-75"
							max="75"
							value={params.contrast * 100}
							onChange={(e) =>
								setParams((prev) => ({
									...prev,
									contrast: Number(e.target.value) / 100,
								}))
							}
							onDoubleClick={() =>
								setParams((prev) => ({
									...prev,
									contrast: 0,
								}))
							}
						/>
					</label>
					<label>
						Netteté
						<input
							type="range"
							min="0"
							max="100"
							value={params.sharpness}
							onChange={(e) =>
								setParams((prev) => ({
									...prev,
									sharpness: Number(e.target.value),
								}))
							}
							onDoubleClick={() =>
								setParams((prev) => ({
									...prev,
									sharpness: 0,
								}))
							}
						/>
					</label>
				</div>
			</section>
		</Card>
	);
}
