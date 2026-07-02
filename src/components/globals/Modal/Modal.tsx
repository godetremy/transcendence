import styles from './component.module.scss';
import { ModalOptions, ModalSuggestionOptions } from '@/components/globals/ModalProvider/ModalProvider';
import { motion, TargetAndTransition } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export interface ModalProps extends ModalOptions {
	close: () => void;
}

function Modal(modal: ModalProps) {
	const [inputValue, setInputValue] = useState('');
	const [suggestions, setSuggestions] = useState<ModalSuggestionOptions[]>([]);

	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const openStateAnimation: TargetAndTransition = { opacity: 1, scale: 1, filter: 'blur(0px)' };
	const closeStateAnimation: TargetAndTransition = { opacity: 0, scale: 1.1, filter: 'blur(5px)' };

	useEffect(() => {}, [inputValue, modal.textInput]);

	return (
		<motion.div
			key={'modal'}
			animate={openStateAnimation}
			initial={closeStateAnimation}
			exit={closeStateAnimation}
			onClick={(modal?.canClose ?? true) ? modal.close : undefined}
			className={styles.modalOverlay}
		>
			<div onClick={(e) => e.stopPropagation()} className={styles.modal}>
				<h3>{modal?.title}</h3>
				{modal?.message && <p>{modal.message}</p>}

				{modal.textInput && (
					<label htmlFor={'modalInput'} className={styles.input_container}>
						<span>{modal.textInput.label}</span>
						<input
							id={'modalInput'}
							type="text"
							placeholder={modal.textInput.placeholder}
							value={inputValue}
							onChange={(e) => {
								setInputValue(e.currentTarget.value);

								if (timerRef.current) {
									clearTimeout(timerRef.current);
									timerRef.current = null;
								}
								setSuggestions([]);

								if (
									!modal.textInput ||
									!modal.textInput.onRequestCompletion ||
									inputValue.trim() === ''
								)
									return;

								timerRef.current = setTimeout(() => {
									if (modal.textInput && modal.textInput.onRequestCompletion)
										modal.textInput.onRequestCompletion(inputValue).then(setSuggestions);
								}, 300);
							}}
						/>
						{suggestions.length > 0 && (
							<div className={styles.suggestions_container}>
								{suggestions.map((suggestion, index) => (
									<button
										key={index}
										onClick={() => {
											setInputValue(suggestion.text);
											setSuggestions([]);
										}}
									>
										{suggestion.leftElement}
										{suggestion.text}
									</button>
								))}
							</div>
						)}
					</label>
				)}

				<div className={styles.buttons}>
					{modal?.buttons?.map((button, index) => (
						<button
							className={button.negative ? styles.negative : ''}
							onClick={() => {
								let preventClosing = false;
								if (button.onClick)
									button.onClick({
										preventClosing: () => (preventClosing = true),
										text: modal.textInput ? inputValue : undefined,
									});
								if (!preventClosing) modal.close();
							}}
							key={index}
						>
							{button.text}
						</button>
					))}
				</div>
			</div>
		</motion.div>
	);
}

export default Modal;
