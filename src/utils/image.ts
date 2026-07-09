import fx, { FxCanvas, FxTexture } from 'glfx';

export interface ImageEditionParameters {
	brightness: number;
	contrast: number;
	sharpness: number;
}

export class ImageEditor {
	public canvas: FxCanvas;
	public params: ImageEditionParameters = { brightness: 0, contrast: 0, sharpness: 0 };
	private texture?: FxTexture;
	private previewTexture?: FxTexture;

	constructor() {
		if (typeof window === 'undefined') {
			throw new Error('ImageEditor must only be created in the browser');
		}
		this.canvas = fx.canvas();
	}

	destroy(): void {
		this.texture?.destroy();
	}

	async loadFullTexture(url: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const full = new Image();

			full.onload = () => {
				if (this.texture) this.texture.loadContentsOf(full);
				else this.texture = this.canvas.texture(full);

				resolve();
			};

			full.onerror = () => {
				reject();
			};

			full.src = url;
		});
	}

	async loadPreviewTexture(file: File): Promise<void> {
		return new Promise(async (resolve) => {
			const bitmap = await createImageBitmap(file, {
				resizeWidth: 1200,
				resizeQuality: 'high',
			});

			if (this.previewTexture) this.previewTexture.loadContentsOf(bitmap);
			else this.previewTexture = this.canvas.texture(bitmap);

			resolve();
		});
	}

	async loadTexture(file: File): Promise<void> {
		const url = URL.createObjectURL(file);
		await Promise.all([this.loadFullTexture(url), this.loadPreviewTexture(file)]);
		URL.revokeObjectURL(url);
	}

	edit(params: ImageEditionParameters): void {
		if (!this.previewTexture) throw new Error('Texture not loaded');

		this.canvas
			.draw(this.previewTexture)
			.brightnessContrast(params.brightness, params.contrast)
			.hueSaturation(0, -1)
			.unsharpMask(params.sharpness, 1)
			.update();
		this.params = params;
	}

	render(): Promise<Blob> {
		return new Promise((resolve, reject) => {
			if (!this.texture) throw new Error('Texture not loaded');

			this.canvas
				.draw(this.texture)
				.brightnessContrast(this.params.brightness, this.params.contrast)
				.hueSaturation(0, -1)
				.unsharpMask(this.params.sharpness, 1)
				.update();

			this.canvas.toBlob(
				(blob) => {
					return blob ? resolve(blob) : reject();
				},
				'image/webp',
				0.8
			);
		});
	}

	renderPreview(): Promise<Blob> {
		return new Promise((resolve, reject) => {
			this.edit(this.params);

			this.canvas.toBlob(
				(blob) => {
					return blob ? resolve(blob) : reject();
				},
				'image/webp',
				0
			);
		});
	}
}
