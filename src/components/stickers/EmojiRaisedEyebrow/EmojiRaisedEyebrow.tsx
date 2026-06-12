import Lottie from 'react-lottie';
import animation from './animation.json';

export function EmojiRaisedEyebrow({ size }: { size?: number }) {
	return (
		<Lottie
			options={{
				loop: true,
				autoplay: true,
				animationData: animation,
			}}
			width={size ?? 130}
			height={size ?? 130}
			style={{ margin: -14 }}
		/>
	);
}
