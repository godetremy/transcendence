declare module 'glfx' {
	interface FxCanvas extends HTMLCanvasElement {
		draw(texture: FxTexture): FxCanvas;
		texture(texture: HTMLImageElement | ImageBitmap): FxTexture;
		brightnessContrast(brightness: number, contrast: number): FxCanvas;
		hueSaturation(hue: number, saturation: number): FxCanvas;
		unsharpMask(radius: number, amount: number): FxCanvas;
		update(): void;
	}

	interface FxTexture {
		loadContentsOf(el: HTMLImageElement | HTMLCanvasElement | ImageBitmap): void;
		destroy(): void;
	}

	function canvas(): FxCanvas;
	function isSupported(): boolean;

	export { canvas, isSupported };
	export type { FxCanvas, FxTexture };
}
