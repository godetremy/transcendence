import Lottie from 'lottie-react';
import animation from './animation.json';

export default function EmojiSunglasses({ size }: { size?: number }) {
	return (
		<Lottie
			animationData={animation}
			loop={true}
			autoplay={true}
			style={{
				width: size ?? 130,
				height: size ?? 130,
				margin: -14,
			}}
		/>
	);
}
