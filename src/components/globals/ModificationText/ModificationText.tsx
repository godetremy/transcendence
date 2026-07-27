import { useState } from 'react';
import styles from './component.module.scss';
import { Pencil, Check } from 'lucide-react';

type ModificationTextProps = {
	value: string;
	onValidate: (value: string) => void;
};

function ModificationText({ value, onValidate }: ModificationTextProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [input, setInput] = useState(value);

	const handleChange = () => {
		onValidate(input);
		setIsEditing(false);
	};

	return (
		<div className={styles.penItem}>
			{isEditing ? (
				<div className={styles.editWrapper}>
					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								handleChange();
							}
						}}
						autoFocus
					/>
					<div role="button" className={styles.validButton} onClick={handleChange}>
						<Check size={16} />
					</div>
				</div>
			) : (
				<span>{value}</span>
			)}
			{!isEditing && (
				<div role="button" className={styles.button} onClick={() => setIsEditing(true)}>
					<Pencil size={16} color="#F2F2F2" opacity={0.6} />
				</div>
			)}
		</div>
	);
}

export default ModificationText;
