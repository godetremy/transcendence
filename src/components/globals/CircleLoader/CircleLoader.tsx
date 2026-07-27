export function CircleLoader({
	progress,
	size = 32,
	strokeWidth = 5,
}: {
	progress: number;
	size?: number;
	strokeWidth?: number;
}) {
	return (
		<svg
			viewBox="0 0 52 52"
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			style={{ transform: 'rotate(-90deg)' }}
		>
			<circle
				cx={26}
				cy={26}
				fill={'none'}
				r={16}
				strokeWidth={strokeWidth}
				stroke={'currentColor'}
				strokeOpacity={0.2}
			/>
			<circle
				cx={26}
				cy={26}
				fill={'none'}
				r={16}
				strokeWidth={strokeWidth}
				stroke={'currentColor'}
				strokeDasharray={`${2 * Math.PI * 16 * progress} ${2 * Math.PI * 16}`}
				strokeLinecap={'round'}
				style={{ transition: '.2s' }}
			/>
		</svg>
	);
}
