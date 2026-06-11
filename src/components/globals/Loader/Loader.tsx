import Lottie from 'react-lottie';
import animation from './animation.json';

export function Loader({ size }: { size?: number }) {
	return (
		<Lottie
			options={{
				loop: true,
				autoplay: true,
				animationData: animation,
			}}
			width={size ?? 40}
			height={size ?? 40}
		/>
	);
}
