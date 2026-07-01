'use client';
import styles from './component.module.scss';
import { useState, useRef, useEffect } from 'react';
import fx, { FxCanvas, FxTexture } from 'glfx';
import { Card } from '@/components/globals/Card/Card';
import { CardHeader } from '@/components/globals/CardHeader/CardHeader';

export interface ImageEditorProps {
	file: File | null;
	visible: boolean;
	setVisible: (visible: boolean) => void;
}

export function ImageEditor(props: ImageEditorProps) {
	const [brightness, setBrightness] = useState(0);
	const [contrast, setContrast] = useState(0);
	const [sharpness, setSharpness] = useState(0);

	const containerRef = useRef<HTMLDivElement>(null);
	const canvaRef = useRef<FxCanvas>(null);
	const textureRef = useRef<FxTexture>(null);

	/**
	 * Load the image in the canva
	 */
	useEffect(() => {
		if (!props.file) return;
		if (!props.visible) {
			if (canvaRef.current) {
				canvaRef.current.remove();
				canvaRef.current = null;
			}
			if (textureRef.current) textureRef.current.destroy();
			return;
		}

		const img = new Image();
		const url = URL.createObjectURL(props.file);

		img.onload = () => {
			URL.revokeObjectURL(url);

			if (!canvaRef.current) {
				canvaRef.current = fx.canvas();
				containerRef.current?.appendChild(canvaRef.current);
			}

			if (textureRef.current) textureRef.current.destroy();
			textureRef.current = canvaRef.current!.texture(img);

			canvaRef.current.draw(textureRef.current);
			canvaRef.current.update();
		};

		img.src = url;
	}, [props.file, props.visible]);

	useEffect(() => {
		if (!canvaRef.current || !textureRef.current) return;

		canvaRef.current
			.draw(textureRef.current)
			.brightnessContrast(brightness / 100, contrast / 100)
			.hueSaturation(0, -1)
			.unsharpMask(sharpness, 1)
			.update();
	}, [brightness, contrast, sharpness]);

	if (!props.file) return null;

	return (
		<Card visible={props.visible} requestClose={() => props.setVisible(false)}>
			<section className={styles.main_container}>
				<CardHeader title={"Modifier l'image"} onClose={() => props.setVisible(false)} />

				<div ref={containerRef} className={styles.preview_container} />

				<div className={styles.options_container}>
					<label>
						Exposition
						<input
							type="range"
							min="-100"
							max="100"
							value={brightness}
							onChange={(e) => setBrightness(Number(e.target.value))}
							onDoubleClick={() => setBrightness(0)}
						/>
					</label>
					<label>
						Contraste
						<input
							type="range"
							min="-100"
							max="100"
							value={contrast}
							onChange={(e) => setContrast(Number(e.target.value))}
							onDoubleClick={() => setContrast(0)}
						/>
					</label>
					<label>
						Sharpness
						<input
							type="range"
							min="0"
							max="255"
							value={sharpness}
							onChange={(e) => setSharpness(Number(e.target.value))}
							onDoubleClick={() => setSharpness(0)}
						/>
					</label>
				</div>
			</section>
		</Card>
	);
}
