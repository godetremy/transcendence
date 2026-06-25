import { useState } from 'react';
import styles from './component.module.scss';
import { Pencil } from 'lucide-react';

type ModificationTextProps = {
	value: string | undefined;
};

export default function ModificationText({ value }: ModificationTextProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [input, setInput] = useState(value);

	const handleChange = () => {
		setIsEditing(false);
	};

	return (
		<div className={styles.penItem}>
			{isEditing ? (
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onBlur={handleChange}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleChange();
						}
					}}
					autoFocus
				/>
			) : (
				<span>{input}</span>
			)}
			<div className={styles.button} onClick={() => setIsEditing(true)}>
				<Pencil size={16} color="#F2F2F2" opacity={0.6} />
			</div>
		</div>
	);
}
