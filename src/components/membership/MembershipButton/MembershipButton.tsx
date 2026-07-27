import styles from './component.module.scss';
import { useMembership } from '@/components/membership/MembershipProvider/MembershipProvider';
import { useUser } from '@/contexts/UserContext';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

function CardDemo(props: { color: string; image: string; className?: string }) {
	return (
		<svg width={63} height={100} viewBox={'0 0 63 100'} fill="none" className={props.className}>
			<rect
				width="100%"
				height="100%"
				rx={4}
				fill={props.color}
				stroke={'#000'}
				strokeOpacity={0.2}
				strokeWidth={1}
			/>
			<rect
				width="100%"
				height="100%"
				rx={4}
				fill="url(#overlay)"
				fillOpacity={0.2}
				style={{ mixBlendMode: 'luminosity' }}
			/>
			<circle cx="31.5" cy="19.5" r="12.5" fill="url(#avatar)" />
			<g opacity="0.8">
				<path
					d={
						'M9 38C9 36.8954 9.89543 36 11 36H52C53.1046 36 54 36.8954 54 38V39C54 40.1046 53.1046 41 52 41H11C9.89543 41 9 40.1046 9 39V38Z'
					}
					fill={'#F2F2F2'}
				/>
				<path
					d={
						'M18.5 44.5C18.5 43.6716 19.1716 43 20 43H43C43.8284 43 44.5 43.6716 44.5 44.5C44.5 45.3284 43.8284 46 43 46H20C19.1716 46 18.5 45.3284 18.5 44.5Z'
					}
					fill={'#F2F2F2'}
				/>
			</g>
			<rect x="12" y="54" width="39" height="39" rx="4" fill="#F2F2F2" />
			<g opacity="0.1">
				<path
					d="M19.5 85C19.7761 85 20 85.2239 20 85.5V88.5C20 88.7761 19.7761 89 19.5 89H16.5C16.2239 89 16 88.7761 16 88.5V85.5C16 85.2239 16.2239 85 16.5 85H19.5Z"
					fill="black"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M20.2041 83.0107C21.2128 83.113 22 83.9643 22 85V89L21.9893 89.2041C21.887 90.2128 21.0357 91 20 91H16C14.8954 91 14 90.1046 14 89V85C14 83.8954 14.8954 83 16 83H20L20.2041 83.0107ZM16 84C15.4477 84 15 84.4477 15 85V89C15 89.5523 15.4477 90 16 90H20C20.5523 90 21 89.5523 21 89V85C21 84.4477 20.5523 84 20 84H16Z"
					fill="black"
				/>
				<path
					d="M48.5 90C48.7761 90 49 90.2239 49 90.5C49 90.7761 48.7761 91 48.5 91H23.5C23.2239 91 23 90.7761 23 90.5C23 90.2239 23.2239 90 23.5 90H48.5Z"
					fill="black"
				/>
				<path
					d="M48.5 88C48.7761 88 49 88.2239 49 88.5C49 88.7761 48.7761 89 48.5 89H23.5C23.2239 89 23 88.7761 23 88.5C23 88.2239 23.2239 88 23.5 88H48.5Z"
					fill="black"
				/>
				<path
					d="M48.5 86C48.7761 86 49 86.2239 49 86.5C49 86.7761 48.7761 87 48.5 87H23.5C23.2239 87 23 86.7761 23 86.5C23 86.2239 23.2239 86 23.5 86H48.5Z"
					fill="black"
				/>
				<path
					d="M48.5 84C48.7761 84 49 84.2239 49 84.5C49 84.7761 48.7761 85 48.5 85H23.5C23.2239 85 23 84.7761 23 84.5C23 84.2239 23.2239 84 23.5 84H48.5Z"
					fill="black"
				/>
				<path
					d="M48.5 82C48.7761 82 49 82.2239 49 82.5C49 82.7761 48.7761 83 48.5 83H23.5C23.2239 83 23 82.7761 23 82.5C23 82.2239 23.2239 82 23.5 82H48.5Z"
					fill="black"
				/>
				<path
					d="M48.5 80C48.7761 80 49 80.2239 49 80.5C49 80.7761 48.7761 81 48.5 81H14.5C14.2239 81 14 80.7761 14 80.5C14 80.2239 14.2239 80 14.5 80H48.5Z"
					fill="black"
				/>
				<path
					d="M48.5 78C48.7761 78 49 78.2239 49 78.5C49 78.7761 48.7761 79 48.5 79H14.5C14.2239 79 14 78.7761 14 78.5C14 78.2239 14.2239 78 14.5 78H48.5Z"
					fill="black"
				/>
				<path
					d="M48.5 76C48.7761 76 49 76.2239 49 76.5C49 76.7761 48.7761 77 48.5 77H14.5C14.2239 77 14 76.7761 14 76.5C14 76.2239 14.2239 76 14.5 76H48.5Z"
					fill="black"
				/>
				<path
					d="M48.5 74C48.7761 74 49 74.2239 49 74.5C49 74.7761 48.7761 75 48.5 75H14.5C14.2239 75 14 74.7761 14 74.5C14 74.2239 14.2239 74 14.5 74H48.5Z"
					fill="black"
				/>
				<path
					d="M48.5 72C48.7761 72 49 72.2239 49 72.5C49 72.7761 48.7761 73 48.5 73H14.5C14.2239 73 14 72.7761 14 72.5C14 72.2239 14.2239 72 14.5 72H48.5Z"
					fill="black"
				/>
				<path
					d="M48.5 70C48.7761 70 49 70.2239 49 70.5C49 70.7761 48.7761 71 48.5 71H14.5C14.2239 71 14 70.7761 14 70.5C14 70.2239 14.2239 70 14.5 70H48.5Z"
					fill="black"
				/>
				<path
					d="M48.5 68C48.7761 68 49 68.2239 49 68.5C49 68.7761 48.7761 69 48.5 69H14.5C14.2239 69 14 68.7761 14 68.5C14 68.2239 14.2239 68 14.5 68H48.5Z"
					fill="black"
				/>
				<path
					d="M48.5 66C48.7761 66 49 66.2239 49 66.5C49 66.7761 48.7761 67 48.5 67H14.5C14.2239 67 14 66.7761 14 66.5C14 66.2239 14.2239 66 14.5 66H48.5Z"
					fill="black"
				/>
				<path
					d="M39.5 64C39.7761 64 40 64.2239 40 64.5C40 64.7761 39.7761 65 39.5 65H23.5C23.2239 65 23 64.7761 23 64.5C23 64.2239 23.2239 64 23.5 64H39.5Z"
					fill="black"
				/>
				<path
					d="M19.5 58C19.7761 58 20 58.2239 20 58.5V61.5C20 61.7761 19.7761 62 19.5 62H16.5C16.2239 62 16 61.7761 16 61.5V58.5C16 58.2239 16.2239 58 16.5 58H19.5Z"
					fill="black"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M20.2041 56.0107C21.2128 56.113 22 56.9643 22 58V62L21.9893 62.2041C21.887 63.2128 21.0357 64 20 64H16C14.8954 64 14 63.1046 14 62V58C14 56.8954 14.8954 56 16 56H20L20.2041 56.0107ZM16 57C15.4477 57 15 57.4477 15 58V62C15 62.5523 15.4477 63 16 63H20C20.5523 63 21 62.5523 21 62V58C21 57.4477 20.5523 57 20 57H16Z"
					fill="black"
				/>
				<path
					d="M46.5 58C46.7761 58 47 58.2239 47 58.5V61.5C47 61.7761 46.7761 62 46.5 62H43.5C43.2239 62 43 61.7761 43 61.5V58.5C43 58.2239 43.2239 58 43.5 58H46.5Z"
					fill="black"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M47.2041 56.0107C48.2128 56.113 49 56.9643 49 58V62L48.9893 62.2041C48.887 63.2128 48.0357 64 47 64H43C41.8954 64 41 63.1046 41 62V58C41 56.8954 41.8954 56 43 56H47L47.2041 56.0107ZM43 57C42.4477 57 42 57.4477 42 58V62C42 62.5523 42.4477 63 43 63H47C47.5523 63 48 62.5523 48 62V58C48 57.4477 47.5523 57 47 57H43Z"
					fill="black"
				/>
				<path
					d="M39.5 62C39.7761 62 40 62.2239 40 62.5C40 62.7761 39.7761 63 39.5 63H23.5C23.2239 63 23 62.7761 23 62.5C23 62.2239 23.2239 62 23.5 62H39.5Z"
					fill="black"
				/>
				<path
					d="M39.5 60C39.7761 60 40 60.2239 40 60.5C40 60.7761 39.7761 61 39.5 61H23.5C23.2239 61 23 60.7761 23 60.5C23 60.2239 23.2239 60 23.5 60H39.5Z"
					fill="black"
				/>
				<path
					d="M39.5 58C39.7761 58 40 58.2239 40 58.5C40 58.7761 39.7761 59 39.5 59H23.5C23.2239 59 23 58.7761 23 58.5C23 58.2239 23.2239 58 23.5 58H39.5Z"
					fill="black"
				/>
				<path
					d="M39.5 56C39.7761 56 40 56.2239 40 56.5C40 56.7761 39.7761 57 39.5 57H23.5C23.2239 57 23 56.7761 23 56.5C23 56.2239 23.2239 56 23.5 56H39.5Z"
					fill="black"
				/>
			</g>
			<defs>
				<linearGradient
					id="overlay"
					x1="64.512"
					y1="100"
					x2="0.726913"
					y2="-0.461532"
					gradientUnits="userSpaceOnUse"
				>
					<stop />
					<stop offset="1" stopColor="white" />
				</linearGradient>
				<pattern id="avatar" width="1" height="1">
					<image href={props.image} width="25" height="25" />
				</pattern>
			</defs>
		</svg>
	);
}

export function MembershipButton(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
	const user = useUser();
	const membership = useMembership();

	return (
		<button
			{...props}
			className={`${styles.membershipButton} ${props.className ?? ''}`}
			onClick={() => {
				membership.showCard();
			}}
		>
			<div className={styles.cards}>
				<CardDemo
					color={'var(--color-primary-green)'}
					image={user?.profile_picture ?? ''}
					className={styles.card_1}
				/>
				<CardDemo color={'#84CFFE'} image={user?.profile_picture ?? ''} className={styles.card_2} />
				<CardDemo
					color={'var(--color-primary-pink)'}
					image={user?.profile_picture ?? ''}
					className={styles.card_3}
				/>
			</div>

			<div className={styles.text}>
				<span>Afficher ma carte</span>
				Profite de tes réductions.
			</div>
		</button>
	);
}
