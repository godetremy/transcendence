import Lottie from 'react-lottie';
import animation from './animation.json';

export function Loader({ size, dark }: { size?: number; dark?: boolean }) {
	const animationData = structuredClone(animation);

	const stroke = animationData.layers[0].shapes[0].it.find((item: { ty?: string }) => item.ty === 'st');

	if (stroke) {
		stroke.c!.k = dark ? [0, 0, 0] : [1, 1, 1];
	}

	return (
		<Lottie
			options={{
				loop: true,
				autoplay: true,
				animationData: animationData,
			}}
			width={size ?? 40}
			height={size ?? 40}
			style={{
				minWidth: size ?? 40,
				minHeight: size ?? 40,
			}}
		/>
	);
}
